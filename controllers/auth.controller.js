// const { validationResult } = require("express-validator");
const User = require("../models/user.model");
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');
require('dotenv').config({
    path: "../configs/config.env"
});

const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

//OAuth2 configuration
const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"   
);
oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
});
const accessToken = oauth2Client.getAccessToken((err,acctoken) => {
    if(err) {
       return 
    } else {
       return acctoken;
    }
});

//Handles the User SignUp part
exports.registerController = async (req,res) => {
    const { fname, lname, email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if(user) {
            return res.status(401).json({ 
                error: "User already exists!" 
            });
        }

        const token = jwt.sign(
            { fname, lname, email, password }, 
            process.env.JWT_KEY, 
            { expiresIn: "10m" }
        );

        //Nodemailer configuration to send mails using gmail
        const smtpTransport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: process.env.GMAIL_ID,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accessToken
            },
            tls: {
                rejectUnauthorized: false
            }
        });
        const mailOptions = {
            from: process.env.GMAIL_ID,
            to: email,
            subject: "Eventz: Confirm Account",
            text: "Click on the link below to confirm your account for Eventz",
            html: `
                <h1>This link is valid for <b>10 minutes</b> only!</h1>
                <a href="${process.env.CLIENT_URL}/user/activate/${token}">Click Here</a>
                <hr />
                <p>This email may contains sensitive information</p>
                <a href="${process.env.CLIENT_URL}">Eventz</a>
                `
        };

        const mailSentResponse = await smtpTransport.sendMail(mailOptions);
        
        if(mailSentResponse) {
            return res.status(200).json({
                message: "Verification email sent, check you mailbox!"
            });
        } 
        return res.status(500).json({
            error: "Something went wrong, Please try again later!"
        });
    } catch(err) {
        console.log(err);
        return res.status(500).json({ error: "Something went wrong, Please Try again later!" });
    }
}

//Handles the confirmation and activation of account
exports.activationController = async (req,res) => {
    const { token } = req.body;
    if (token) {
        jwt.verify(token,process.env.JWT_KEY, async (error, decoded) => {
            if(error) {
                return res.status(400).json({
                    error: "Invalid Link",
                });
            } else if(decoded == undefined) {
                return res.status(400).json({
                    error: "Link expired"
                })
            } else {
                const { fname, lname, email, password } = decoded;

                //Saving user data to database
                const user = new User(
                    {
                        name: {
                            fname,
                            lname
                        },
                        email,
                        hashed_password: password
                    }
                );
                user.save((err, user) => {
                    if (err) {
                        if(err.code === 11000) {
                            return res.status(403).json({
                                error: "Email already confirmed!"
                            });
                        }
                        console.log(err);

                        return res.status(500).json({
                            error: "Something went wrong, Please try again later!"
                        });
                    } else {
                        //TODO:Redirect to Login page
                        return res.status(200).json({
                            message: 'Email Confirmed!'
                        });
                    }
                });
            }
        })
    } else {
        return res.status(401).json({
            error: "No token received!"
        });
    }
}


//Handles the Login part
exports.loginController = async (req,res) => {
    const {email,password} = req.body;
    try {
        const userdata = await User.login(email,password);
        const maxAge = 24 * 60 * 60; //1day
        const token = jwt.sign({ _id: userdata?._id }, process.env.JWT_KEY, { expiresIn: maxAge });
        res.cookie('jwt', token, { 
            maxAge: maxAge * 1000,
            // httpOnly: false, 
            // sameSite: "none",
            // secure: true
        });
        return res.status(200).json({
            message: "Login Successfull!",
            user: {
                type: "user",
                name: userdata?.fullName,
                email: userdata?.email,
                id: userdata?._id,
                imageLocation: userdata?.imageLocation
            }
        });
    } catch(err) {
        return res.status(401).json({
            error: err.message
        });
    }
}

//Handles Forgot password by sending email to the user
exports.forgetPassword = async (req,res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            const token = jwt.sign({ email }, process.env.JWT_KEY, { expiresIn: "10m" });
            //TODO: Send link to redirect to reset password page
            const smtpTransport = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    type: "OAuth2",
                    user: process.env.GMAIL_ID,
                    clientId: process.env.CLIENT_ID,
                    clientSecret: process.env.CLIENT_SECRET,
                    refreshToken: process.env.REFRESH_TOKEN,
                    accessToken: accessToken
                },
                tls: {
                    rejectUnauthorized: false
                }
            });
            const mailOptions = {
                from: process.env.GMAIL_ID,
                to: email,
                subject: "Eventz: Reset Password",
                text: "Click on the link below to reset your password for Eventz",
                html: `
                        <h1>This link is valid for <b>10 minutes</b> only!</h1>
                        <a href="${process.env.CLIENT_URL}/user/resetpassword/${token}">Reset Password</a>
                        <hr/>
                        <p>This email may containe sensetive information</p>
                        <a href="${process.env.CLIENT_URL}">Eventz</a>
                        `
            };

            const mailSentResponse = await smtpTransport.sendMail(mailOptions);

            if (mailSentResponse) {
                return res.status(200).json({
                    message: "Password reset link sent, Check your mailbox!"
                });
            } else {
                return res.status(500).json({
                    error: "Something went wrong, Please try again later!"
                });
            }
        } else {
            return res.status(401).json({ error: "User doesn't exists!" });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: "Something went wrong, Please try again later!"
        });
    }
}

exports.resetPassword = async (req,res) => {
    const { token,password } = req.body;
    if(token) {
        try {
            //This is synchronous
            const decoded = jwt.verify(token, process.env.JWT_KEY);
            if(decoded) {
                const {email} = decoded;
                //Save changed password
                const user = await User.findOne({ email });                
                user.hashed_password = password;
                await user.save();

                return res.status(201).json({
                    message: "Password updated successfully!"
                });
            } else {
                return res.status(401).json({
                    error: "Failed to verify user"
                });
            }
        } catch(err) {
            return res.status(401).json({
                error: "Failed to verify user"
            });
        }
    }
    return res.status(404).json({
        error: "No token found"
    });
}


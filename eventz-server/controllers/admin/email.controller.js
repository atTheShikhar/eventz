require('dotenv').config({
    path: "../../configs/config.env"
});
const nodemailer = require("nodemailer");
const { google } = require('googleapis');

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

exports.sendEmailController = async (req,res) => {
    const {email,subject,message} = req.body;
    if(email == null || subject == null || message == null || 
        subject.length === 0 || message.length === 0
    ) {
        return res.status(400).json({error: "Invalid request!"});
    }

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
        subject: "Eventz-Admin: "+subject,
        html: `
            <p>${message}</p>
            <hr />
            <p>This email may contains sensitive information</p>
            <a href="${process.env.CLIENT_URL}">Eventz</a>
            `
    };

    const mailSentResponse = await smtpTransport.sendMail(mailOptions);
    
    if(mailSentResponse) {
        return res.status(200).json({
            message: "Email sent successfully!"
        });
    } 
    return res.status(500).json({
        error: "Something went wrong, Please try again later!"
    });
}
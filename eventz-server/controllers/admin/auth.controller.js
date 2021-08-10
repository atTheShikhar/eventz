const Admin = require('../../models/admin.model');
const jwt = require('jsonwebtoken');
require('dotenv').config({
    path: "../../configs/config.env"
});

exports.loginController = async (req,res) => {
    const {username,password} = req.body;
    try {
        const admin = await Admin.find({username,password});
        
        if(admin.length > 0) {
            const maxAge = 24*60*60;
            const token = jwt.sign({ id: admin[0]._id },process.env.JWT_KEY,{expiresIn: maxAge})
            res.cookie('jwt', token, {
                maxAge: maxAge * 1000,
                // httpOnly: false, 
                // sameSite: "none",
                // secure: true
            });
            return res.status(200).json({
                message: "Login Successfull!",
                user: {
                    type: "admin"
                }
            });
        } 

        return res.status(401).json({error: "You are not the Admin"});
    } catch(e) {
        console.log(e);
        return res.status(500).json({error: "Server Error :("})
    }
}
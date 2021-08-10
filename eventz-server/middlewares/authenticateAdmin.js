require('dotenv').config({
    path: "../configs/config.env"
});
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin.model');

const authenticateAdmin = async (req,res,next) => {
    const token = req.cookies.jwt;
    jwt.verify(token,process.env.JWT_KEY,async (error,decoded) => {
        if(error) 
            return res.status(401).json({error: "You are not the admin!"});
        const id = decoded.id;
        try {
            const admin = await Admin.findById(id);
            if(Boolean(admin))
                return next();
            return res.status(401).json({error: "You are not the admin!"});
        } catch(err) {
            console.log(err);
            return res.status(500).json({error: "Server Error!"});
        }
    })
}

module.exports = authenticateAdmin;
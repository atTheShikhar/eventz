require('dotenv').config({
    path: "../configs/config.env"
});
const jwt = require('jsonwebtoken');

const authenticate = idName => async (req,res,next) => {
    const token = req.cookies.jwt;
    
    jwt.verify(token,process.env.JWT_KEY,(error,decoded) => {
        if(error) {
            return res.status(401).json({error: "User not authorized!"});
        }
        req.body = {
            ...req.body,
            [idName]: decoded._id
        } 
        next();
    })
}

module.exports = authenticate;
const { validationResult } = require('express-validator');

const validate = (req,res,next) => {
    const err = validationResult(req);
    if(!err.isEmpty()) {
        return res.status(400).json({ 
            error: err.errors[0].msg
        });
    }
    next();
}

module.exports = validate;
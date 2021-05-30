const express = require("express");
const router = express.Router();
const {
    validSignUp,
    validLogin,
    validPassword
} = require("../helpers/auth.validation");
const validate = require('../middlewares/validate');
const {
    registerController,
    activationController,
    loginController,
    forgetPassword,
    resetPassword
} = require("../controllers/auth.controller");

//Route for handling new signup request
router.post("/register",validSignUp,validate,registerController);
router.post("/activate",activationController);

// //Handles new login request
router.post("/login",validLogin,validate,loginController);

// //Handles forgot password and resetting
router.post("/forgetpassword",forgetPassword);
router.put("/resetpassword",validPassword,validate,resetPassword);


module.exports = router;
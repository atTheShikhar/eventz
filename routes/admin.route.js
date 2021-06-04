const express = require('express');
const { loginController } = require('../controllers/admin/auth.controller');
const router = express.Router();


router.post('/admin/login',loginController);


module.exports = router;
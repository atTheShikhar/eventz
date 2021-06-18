const express = require('express');
const { loginController } = require('../controllers/admin/auth.controller');
const { 
	getMessagesController, 
	getEventsController,
	approveDeleteEventsController, 
	getUsersController, 
	deleteMessageController, 
	deleteUsersController
} = require('../controllers/admin/data.controller');
const authenticateAdmin = require('../middlewares/authenticateAdmin');
const router = express.Router();


router.post('/admin/login',loginController);

router.post('/admin/messages',authenticateAdmin,getMessagesController);
router.post('/admin/delete/message',authenticateAdmin,deleteMessageController)

router.post('/admin/events',authenticateAdmin,getEventsController);
router.post('/admin/approve/event',authenticateAdmin,approveDeleteEventsController);
router.post('/admin/delete/event',authenticateAdmin,approveDeleteEventsController);

router.post('/admin/users',authenticateAdmin,getUsersController);
router.post('/admin/delete/user',authenticateAdmin,)


module.exports = router;
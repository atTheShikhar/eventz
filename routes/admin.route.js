const express = require('express');
const { loginController } = require('../controllers/admin/auth.controller');
const { 
	getMessagesController, 
	getEventsController,
	approveDeleteEventsController, 
	getUsersController, 
	deleteMessageController, 
	deleteUsersController,
	getEventByIdController,
	updateEventController
} = require('../controllers/admin/data.controller');
const { sendEmailController } = require('../controllers/admin/email.controller');
const { validEmailId } = require('../helpers/auth.validation');
const authenticateAdmin = require('../middlewares/authenticateAdmin');
const validate = require('../middlewares/validate');
const router = express.Router();


router.post('/admin/login',loginController);
router.post('/admin/send-email',authenticateAdmin,validEmailId,validate,sendEmailController);

router.post('/admin/messages',authenticateAdmin,getMessagesController);
router.post('/admin/delete/message',authenticateAdmin,deleteMessageController);

router.get('/admin/event/:id',authenticateAdmin,getEventByIdController);
router.post('/admin/events',authenticateAdmin,getEventsController);
router.post('/admin/event/update',authenticateAdmin,updateEventController);
router.post('/admin/approve/event',authenticateAdmin,approveDeleteEventsController);
router.post('/admin/delete/event',authenticateAdmin,approveDeleteEventsController);

router.post('/admin/users',authenticateAdmin,getUsersController);
router.post('/admin/delete/user',authenticateAdmin,deleteUsersController)


module.exports = router;
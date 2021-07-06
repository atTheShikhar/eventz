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
const { getTicketsCountController } = require('../controllers/admin/tickets.controller');
const { sendEmailController } = require('../controllers/admin/email.controller');
const { validEmailId } = require('../helpers/auth.validation');
const authenticateAdmin = require('../middlewares/authenticateAdmin');
const validate = require('../middlewares/validate');
const { getPaymentsController } = require('../controllers/admin/payments.controller');
const { fetchTicketsController, getBookingsByEventsController } = require('../controllers/tickets.controller');
const { attendanceController, getUserController } = require('../controllers/user.controller');
const router = express.Router();


router.post('/admin/login',loginController);
router.post('/admin/send-email',authenticateAdmin,validEmailId,validate,sendEmailController);

router.post('/admin/messages',authenticateAdmin,getMessagesController);
router.post('/admin/delete/message',authenticateAdmin,deleteMessageController);

//Routes to get all the events information by the admin
router.get('/admin/event/:id',authenticateAdmin,getEventByIdController);
router.get('/admin/event/get-tickets-count/:id',authenticateAdmin,getTicketsCountController)
router.post('/admin/events',authenticateAdmin,getEventsController);
router.post('/admin/event/update',authenticateAdmin,updateEventController);
router.post('/admin/approve/event',authenticateAdmin,approveDeleteEventsController);
router.post('/admin/delete/event',authenticateAdmin,approveDeleteEventsController);

//Get event's booking related information
router.post('/admin/get-bookings/',authenticateAdmin,getBookingsByEventsController);
router.post('/admin/get-attendance',authenticateAdmin,attendanceController);

//Routes to get all the user data;
router.get('/admin/users',authenticateAdmin,getUsersController); //All user Info
router.post('/admin/user',authenticateAdmin,getUserController); //Single User info
router.post('/admin/users/bookings',authenticateAdmin,fetchTicketsController);
router.post('/admin/delete/user',authenticateAdmin,deleteUsersController)

//Get all the payments initiated
router.get('/admin/payments',authenticateAdmin,getPaymentsController);


module.exports = router;
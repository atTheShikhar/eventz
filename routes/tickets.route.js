const express = require('express');
const router = express.Router();
const { 
	bookFreeTicketsController, 
	bookPaidTicketsController,
	fetchTicketsController,
	verifyPaymentController, 
	verifyPaymentWebhookController
} = require('../controllers/tickets.controller');
const authenticate = require('../middlewares/authenticate');
const validTicketRequest = require('../middlewares/validTicketRequest');

router.post("/book-tickets",
	authenticate("requestedBy"),
	validTicketRequest,
	bookFreeTicketsController,
	bookPaidTicketsController
)
router.post("/verify-payments",verifyPaymentController);
router.post("/verify-payments-webhook",verifyPaymentWebhookController);

router.post("/my-tickets",authenticate("requestedBy"),fetchTicketsController);

module.exports = router;
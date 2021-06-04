const express = require('express');
const router = express.Router();
const { bookTicketsController, fetchTicketsController } = require('../controllers/tickets.controller');
const authenticate = require('../middlewares/authenticate');

router.post("/book-tickets",authenticate("requestedBy"),bookTicketsController)
router.post("/my-tickets",authenticate("requestedBy"),fetchTicketsController);

module.exports = router;
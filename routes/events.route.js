const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const validate = require("../middlewares/validate");
const { validEvent } = require('../helpers/event.validation');
const {
    createController,
    getEventsController
} = require('../controllers/events.controller');

router.post("/create-event",authenticate,validEvent,validate,createController);
router.get("/get-events",getEventsController)

module.exports = router;
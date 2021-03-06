const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const validate = require("../middlewares/validate");
const { validPosterUpload } = require('../middlewares/validImages');
const { validEvent } = require('../helpers/event.validation');
const {
    createController,
    getEventsController,
    getEventsAuthController,
    eventImageController,
} = require('../controllers/events.controller');
const {
    getBookingsByEventsController
} = require('../controllers/tickets.controller');
const validOrganiser = require('../middlewares/validOrganiser');

router.post("/create-event",
    authenticate("createdBy"),
    validEvent,
    validate,
    createController
);
router.post("/events/upload-image/:id",
    authenticate("uploadedBy"),
    validPosterUpload,
    eventImageController
)

router.get("/get-events",getEventsController)
router.post("/get-events-auth",
    authenticate("requestedBy"),
    getEventsAuthController
);

router.post("/get-bookings",
    authenticate("requestedBy"),
    validOrganiser,
    getBookingsByEventsController
)

module.exports = router;
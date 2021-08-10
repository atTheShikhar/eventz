const express = require('express');
const router = express.Router();
const { 
    eventsMetaController, 
    addressMetaController,
    messagesController 
} = require('../controllers/meta.controller');

router.get('/events-metadata',eventsMetaController);

//Can query states data by /address-metadata?get=states
//Can query district data by /address-metadata?get=district&state_id={value}
router.get('/address-metadata',addressMetaController);

router.post('/contact-us',messagesController)

module.exports = router;
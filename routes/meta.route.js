const express = require('express');
const { eventsMetaController, addressMetaController } = require('../controllers/meta.controller');
const router = express.Router();

router.get('/events-metadata',eventsMetaController);

//Can query states data by /address-metadata?get=states
//Can query district data by /address-metadata?get=district&state_id={value}
router.get('/address-metadata',addressMetaController);

module.exports = router;
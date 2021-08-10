const NewEvent = require('../models/events.model'); 

exports.validPosterUpload = async (req,res,next) => {
    try {
        const eventId = req.params.id;
        const eventData = await NewEvent.findById(eventId);
        const organiser = eventData.createdBy;    

        if(organiser.toString() !== req.body.uploadedBy)
            return res.status(401).json({error: "Unauthorised!"});
        next();
    } catch(e) {
        console.log(e);
        return res.status(500).json({error: "Server Error :("});
    }
}

const User = require('../models/user.model');
const validOrganiser = async (req,res,next) => {
    const {requestedBy,eventId} = req.body;
    try {
		const organiserData = await User.findById(requestedBy);

		if(Boolean(organiserData)) {
			const createdEvents = organiserData?.createdEvents?.map(elem => elem.toString());

			if(createdEvents.includes(eventId)) {
                return next();
            }

            return res.status(401).json({error: "Unauthorized!"});
        }

        return res.status(400).json({error: "Invalid Request"})
    } catch(e) {
        console.log(e);
        return res.status(500).json({error: "Server Error"})
    }
}

module.exports = validOrganiser;
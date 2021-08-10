const NewEvent = require("../../models/events.model");
const Ticket = require("../../models/tickets.model");

exports.getTicketsCountController = async (req,res) => {
    const eventId = req?.params?.id;
    if(eventId == null) {
        return res.status(400).json({error: "Invalid Request"});
    } 

    try {
        const eventData = await NewEvent.findById(eventId,{"eventDetails.noOfPeople": 1});
        const totalTickets = parseInt(eventData?.eventDetails?.noOfPeople.split(" ")[1]);

        const bookedTickets = await Ticket.find({eventId}).countDocuments();
        
        return res.status(200).json({totalTickets,bookedTickets});
    } catch(e) {
        console.log(err);
        return res.status(500).json({error: "Server Error :("}); 
    }
}
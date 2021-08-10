const Ticket = require('../models/tickets.model');
const NewEvent = require('../models/events.model');

const validTicketRequest = async (req,res,next) => {
    try {
        const {requestedBy,eventId,ticketCount} = req.body;
        const count = parseInt(ticketCount);
        if(count < 1 || count > 5) {
            return res.status(400).json({error: "Invalid ticket request!"});
        }
        const eventData = await NewEvent.findById(eventId);
        if(Boolean(eventData)) {
            
            if(eventData.createdBy == requestedBy) {
                return res.status(400).json({error: "You are the organiser of this event!"})
            }
            
            //Check if available that max no of bookings done
            const noOfPeople = eventData.eventDetails.noOfPeople.split(" ")[1];
            const max = parseInt(noOfPeople)
            const currentTotalTickets = await Ticket.find({eventId: eventId}).countDocuments();
            if(((currentTotalTickets??0) + count) > max) {
                return res.status(400).json({error: "Sorry, All tickets are booked for this event!"})
            }
            
            const tickets = await Ticket.find({userId: requestedBy, eventId: eventId}).countDocuments();
            const totalTickets = (tickets??0) + count;
            if(totalTickets > 5) {
                return res.status(400).json({ error: "You can only book 5 tickets per account!"});
            }
            
            //appending event data to prevent db call in another middleware
            req.body = {
                ...req.body,
                eventData: eventData,
                count: count,
                totalTickets: totalTickets 
            }
            return next();
        }
        return res.status(400).json({error: "Can't generate ticket for invalid event!"})
    } catch (e) {
        console.log(e);
        return res.status(500).json({error: "Server Error :("});
    }
} 

module.exports = validTicketRequest;
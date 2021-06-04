const Ticket = require('../models/tickets.model');
// const User = require('../models/user.model');
const NewEvent = require('../models/events.model');

exports.bookTicketsController = async (req,res) => {
    try {
        const {requestedBy,eventId,ticketCount} = req.body;
        const count = parseInt(ticketCount);
        if(count < 1 || count > 5) {
            return res.status(400).json({error: "Invalid ticket request!"});
        }
        const eventDetails = await NewEvent.findById(eventId);
        console.log(eventDetails);
        if(Boolean(eventDetails)) {
            if(eventDetails.createdBy == requestedBy) {
                return res.status(400).json({error: "You are the organiser of this event!"})
            }
            
            const tickets = await Ticket.find({userId: requestedBy, eventId: eventId}).countDocuments();
            const totalTickets = (tickets??0) + count;
            if(totalTickets > 5) {
                return res.status(400).json({ error: "You can only book 5 tickets per account!"});
            }
            
            let createdTickets = [];
            for(let i=0;i<count;i++) {
                const newTicket = new Ticket({userId: requestedBy,eventId: eventId});
                const val = await newTicket.save();
                createdTickets.push(val);
            } 

            return res.status(200).json({
                message: "Tickets booked successfully!",
                count: totalTickets,
                createdTickets: createdTickets
            });
        }
        return res.status(400).json({error: "Can't generate ticket for invalid event!"})
    } catch (e) {
        console.log(e);
        return res.status(500).json({error: "Server Error :("});
    }
}

exports.fetchTicketsController = async (req,res) => {
    try {
        const { requestedBy } = req.body;
        const tickets = await Ticket.find({userId: requestedBy});
        const ticketCount = tickets.length;

        // let uniqueEventIds = [];
        // for(let i=0;i<ticketCount;i++) {
        //     const id = tickets[i].eventId; 
        //     if(i==0) {
        //         uniqueEventIds.push(id);
        //     } else {
        //         if(id != uniqueEventIds[i-1])
        //             uniqueEventIds.push(id);
        //     }
        // }
        let eventDetails = [];
        for(let i=0;i<ticketCount;i++) {
            const ticket = tickets[i];
            const details = await NewEvent.findById(ticket.eventId);
            eventDetails.push(details);
        }

        return res.json({count: ticketCount,tickets,eventDetails});

    } catch(e) {
        console.log(e);
        return res.status(500).json({error: "Server Error :("});
    }
}
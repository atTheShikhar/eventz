const Ticket = require('../models/tickets.model');

const generateTickets = async (count,userId,eventId) => {
    let createdTickets = [];
    for(let i=0;i<count;i++) {
        const newTicket = new Ticket({userId,eventId});
        const val = await newTicket.save();
        createdTickets.push(val);
    } 
    return createdTickets;
}

module.exports = generateTickets;
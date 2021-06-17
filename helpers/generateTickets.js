const { nanoid } = require('nanoid');
const Ticket = require('../models/tickets.model');

const generateTickets = async (count,userId,eventId) => {
    let createdTickets = [];
    for(let i=0;i<count;i++) {
        const ticketId = nanoid(10);
        const newTicket = new Ticket({ticketId,userId,eventId});
        const val = await newTicket.save();
        createdTickets.push(val);
    } 
    return createdTickets;
}

module.exports = generateTickets;
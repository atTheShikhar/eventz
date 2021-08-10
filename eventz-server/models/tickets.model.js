const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
    {
        ticketId: {
            type: String,
            required: true
        },
        userId: {
            type: mongoose.ObjectId,
            required: true
        },
        eventId: {
            type: mongoose.ObjectId,
            required: true
        },
        availed: {
            type: String,
            required: false   
        }
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at"
        },
        collection: "tickets"
    }
)

ticketSchema.index({'$**': 'text'});

module.exports = mongoose.model("Ticket",ticketSchema);
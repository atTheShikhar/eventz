const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.ObjectId,
            required: true
        },
        eventId: {
            type: mongoose.ObjectId,
            required: true
        },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at"
        },
        collection: "tickets"
    }
)

module.exports = mongoose.model("Ticket",ticketSchema);
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
	{
        order_id: {
            type: String,
            required: true,
        },
        payment_id: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        amount_paid: {
            type: Number,
            required: true
        },
        amount_due: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            required: true
        },
        receipt: {
            type: String,
            required: true
        },
        payment_status: {
            type: String,
            required: true
        },
        user_id: {
            type: mongoose.ObjectId,
            required: true
        },
        event_id: {
            type: mongoose.ObjectId,   
            required: true
        },
        ticket_count: {
            type: Number,
            required: true
        },
        description: {
            type: String,
            required: false
        }
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at"
        },
        collection: "payments"
    }
)

module.exports = mongoose.model("Payments",paymentSchema);
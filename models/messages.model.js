const mongoose = require("mongoose");

const messagesSchema = new mongoose.Schema(
    {
        messageType: {
            type: String,
            required: true,
            trim: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
        },
        subject: {
            type: String,
            required: true,
            trim: true
        },
        message: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at"
        },
        collection: "messages"
    }
)

module.exports = mongoose.model("Messages",messagesSchema);
const mongoose = require('mongoose');

const adminSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true
        },
        password: {
            type: String,
            required: true
        },    
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at"
        },
        collection: "admin"
    }
);

module.exports = mongoose.model("Admin",adminSchema);
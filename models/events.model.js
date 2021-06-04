const mongoose = require("mongoose");

const eventSchema = mongoose.Schema(
    {
       eventDetails: {
           title: {
               type: String,
               required: true,
               trim: true,
               maxLength: 100
           },
           description: {
               type: String,
               required: true,
               trim: true,
               maxLength: 2000
           },
           noOfPeople: {
               type: String,
               required: true,
               trim: true,
               maxLength: 20
           },
           dateAndTime: {
               type: Date, 
               required: true,
           },
           genre: {
               type: String,
               required: true,
               trim: true,
               maxLength: 50
           }
       },
       eventAddress: {
            apartment: {
                type: String,
                required: true,
                trim: true,
                maxLength: 50                
            },
            street: {
                type: String,
                required: true,
                trim: true,
                maxLength: 100
            },
            city: {
                type: String,
                required: true,
                trim: true,
                maxLength: 40
            },
            pincode: {
                type: String,
                required: true,
                trim: true,
                maxLength: 6,
                minLength: 6
            },
            stateName: {
                type: String,
                required: true,
                trim: true,
                maxLength: 100
            },
            country: {
                type: String,
                required: true,
                trim: true,
                maxLength: 100
            }
       },
       eventOrganiser: {
           organiserName: {
               type: String,
               required: true,
               trim: true,
               maxLength: 50
           },           
           phone: {
               type: String,
               required: true
           },
           email: {
               type: String,
               required: true,
               trim: true,
           },
           orgName: {
               type: String,
               trim: true,
               maxLength: 100
           }
       },
       createdBy: {
           type: mongoose.ObjectId,
           required: true
       },
       imageLocation: {
           type: String,
           required: false
       }
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at"
        },
        collection: "events"
    }
)

module.exports = mongoose.model("NewEvent",eventSchema);
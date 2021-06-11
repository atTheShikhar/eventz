const Messages = require('../../models/messages.model');
const NewEvent = require('../../models/events.model')
const User = require('../../models/user.model');

exports.getMessagesController = async (req,res) => {
    const {type} = req.query;

    let query = {};
    if(type === "Feedback")
        query.messageType = "Feedback"
    if(type === "Question")
        query.messageType = "Question"

    try {
        const messages = await Messages.find(query);
        const length = messages.length;

        const messageData = messages.map(message => ({
            _id: message._id,
            messageType: message.messageType,
            name: message.name,
            email: message.email,
            subject: message.subject,
            message: message.message,
            date: new Date(message.created_at).toLocaleDateString(),
            time: new Date(message.created_at).toLocaleTimeString()
        }));
        
        // console.log(messageData)

        return res.status(200).json({
            length,
            messages: messageData
        })
    } catch(e) {
        console.log(e);
        return res.status(500).json({error: "Server Error"})
    }
}
exports.deleteMessageController = async (req,res) => {
    const {id} = req.body;
    try {
        const status = await Messages.deleteOne({_id: id});
        console.log(status);
        return res.status(200).json({message: "Message Deleted Successfully"});
    } catch(err) {
        console.log(err)
        return res.status(500).json({error: "Server Error"})
    }
}

exports.getEventsController = async (req,res) => {
    const {type} = req.query;

    let query = {}
    if(type === "Pending") {
        query.status = "pending";
    } 
    if(type === "Approved") {
        query.status = "approved";
    }

    try {
        const events = await NewEvent.find(query);
        const length = events.length;

        const newEvent = events.map(event => {
            const {
                _id,
                eventDetails,
                eventAddress,
                eventOrganiser,
                status,
                // createdBy,
                updated_at
            } = event;

            const address = `${eventAddress.apartment}, ${eventAddress.street}, ${eventAddress.district},${eventAddress.stateName} - (${eventAddress.pincode}),${eventAddress.country}`

            const createdAt = `${new Date(updated_at).toLocaleString()}`
            const price = eventDetails.isFree === "No" ? eventDetails.price : "FREE";
            const organiserContact = `Phone: ${eventOrganiser.phone}, Email: ${eventOrganiser.email}`
            return {
                _id: _id,
                title: eventDetails.title,
                address: address,
                createdAt: createdAt,
                organiserName: eventOrganiser.organiserName,
                organiserContact: organiserContact,
                noOfPeople: eventDetails.noOfPeople,
                price: price,
                status: status,
            }
        });

        return res.status(200).json({
            length,
            events: newEvent
        })
    } catch(e) {
        console.log(e);
        return res.status(500).json({error: "Server Error"})
    }
}
exports.approveDeleteEventsController = async (req,res) => {
    const {id,action} = req.body;
    try {

        if(action==="Approve") {
            const response = await NewEvent.findByIdAndUpdate(id,{status: "approved"});
            // console.log(response)
            return res.status(200).json({message: "Event Approved Successfully!"});
        }
        if(action==="Delete") {
            const response = await NewEvent.findByIdAndRemove(id);
            // console.log(response)
            return res.status(200).json({message: "Event Deleted Successfully!"});
        }

        return res.status(400).json({error: "Invalid request!"});
    } catch(e) {
        console.log(e);
        return res.status(500).json({error: "Server Error"})
    }
}

exports.getUsersController = async (req,res) => {
    try {
        const users = await User.find({});
        const length = users.length;
        const userWithoutPassword = users.map(item => {
            return {
                name: item.name,
                _id: item._id,
                email: item.email,
                created_at: item.created_at,
                updated_at: item.updated_at
            };
        })
        return res.status(200).json({
            length,
            userWithoutPassword
        })
    } catch(e) {
        console.log(e);
        return res.status(500).json({error: "Server Error"})
    }
}
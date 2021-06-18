const Messages = require('../../models/messages.model');
const NewEvent = require('../../models/events.model')
const User = require('../../models/user.model');
const Ticket = require('../../models/tickets.model');

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
        // console.log(status);
        return res.status(200).json({message: "Message Deleted Successfully"});
    } catch(err) {
        console.log(err)
        return res.status(500).json({error: "Server Error"})
    }
}

exports.getEventsController = async (req,res) => {
    const {type} = req.query;
    const {userId,eventId} = req.body;

    let query = {}
    if(type === "Pending") {
        query.status = "pending";
    } 
    if(type === "Approved") {
        query.status = "approved";
    }
    if(userId) {
        query.createdBy = userId;
    }
    if(eventId) {
        query._id = eventId;
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
            //Check if it is a paid event and have some bookings
            const eventData = await NewEvent.findById(id,{eventDetails: 1}); 

            if(eventData?.eventDetails?.isFree === "No") {
                const ticketCount = await Ticket.find({eventId: id}).countDocuments();
                if(ticketCount > 0) {
                    return res.status(400).json({error: "Cannot delete paid events with bookings!"});
                }
            } 
            
            const removedEvent = await NewEvent.findByIdAndRemove(id);

            //Delete events form organisers created Events
            await User.findByIdAndUpdate(removedEvent.createdBy,{ $pull: {
                    "createdEvents": id
            }})
            
            //Delete events from attenders booked events
            await User.updateMany({bookedEvents: id},{ $pull: {
                "bookedEvents": id
            }})

            //Delete all tickets for that event
            await Ticket.deleteMany({eventId: id});

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

        const userWithoutPassword = users.map((item,index) => {
            const createdAt = new Date(item.created_at).toLocaleString();
            return {
                _id: item._id,
                name: item.name.fname+" "+item.name.lname,
                email: item.email,
                createdAt: createdAt,
                createdEvents: item?.createdEvents,
                bookedEvents: item?.bookedEvents,
                imageLocation: item?.imageLocation
            };
        })
        return res.status(200).json({
            length,
            users: userWithoutPassword
        })
    } catch(e) {
        console.log(e);
        return res.status(500).json({error: "Server Error"})
    }
}
exports.deleteUsersController = async (req,res) => {
    const { id } = req.body;
    try {
        const eventData = await User.findById(id,{createdEvents: 1, bookedEvents: 1});
        
        const createdEvents = eventData?.createdEvents;
        const bookedEvents = eventData?.bookedEvents;

        if(createdEvents?.length > 0) {
            for(let i=0;i<createdEvents?.length;i++) {
                const eventId = createdEvents[i];
                const countTickets = await Ticket.find({eventId: eventId}).countDocuments();
                if(countTickets > 0) {
                    return res.status(400).json({error: "Cannot delete user whose events are booked!"});
                }
            }
        }

        if(bookedEvents?.length > 0) {
            for(let i=0;i<bookedEvents?.length;i++) {
                const eventId = bookedEvents[i];
                const { eventDetails } = await NewEvent.findById(eventId,{eventDetails: 1});
                if(eventDetails?.isFree === "No")
                    return res.status(400).json({error: "Cannot delete user with paid bookings!"});
            }            
        }

        await User.findByIdAndRemove(id);

        await NewEvent.deleteMany({createdBy: id})

        return res.status(200).json({message: "User Deleted Successfully!"})
    } catch(e) {
        console.log(e);
        return res.status(500).json({error: "Server Error"})
    }
}
const NewEvent = require('../models/events.model');
const User = require('../models/user.model');
const uploadSingle = require('../middlewares/imageUpload');
require('dotenv').config({
    path: "../configs/config.env"
});

exports.createController = async (req,res) => {
    let data = req.body;
    let msg = "";
    if(data.eventDetails.isFree === "Yes") {
        data = {
            ...data,
            status: "approved"
        }
        msg = "Event created successfully!"
    } else {
        data = {
            ...data,
            status: "pending"
        }
        msg = "Event pending for approval!"
    }
    try{
        const createEvent = new NewEvent(data);
        const created = await createEvent.save();
        //Push the eventId to user collection
        const updateUserData = await User.findByIdAndUpdate(req.body.createdBy,{
            $push: {
                createdEvents: created._id
            }
        });

        return res.status(201).json({message: msg, eventData: created})
    } catch(err) {
        console.log(err);
        return res.status(500).json({error: err.message})
    }
}

exports.eventImageController = async (req,res) => {
    try {
        const saveFileName = "poster-"+req.params.id;
        const upload = uploadSingle('eventPoster','public/uploads/events',saveFileName);
        upload(req,res,async function(err) {
            if(err) {
                return res.status(400).json({error: err.message})
            }
            const id = req.params.id;
            const imageLocation = `/uploads/events/${req.file.filename}`;
            const oldEvent = await NewEvent.findById(id);
            oldEvent.imageLocation = imageLocation;
            await oldEvent.save(); 
            return res.status(200).json({message: "Image Uploaded successfully!"});
        });
    } catch(err) {
        console.log(err);
        return res.status(500).json({error: "Server Error :("});
    }
}

exports.getEventsController = async (req,res) => {
    try {
        const pageNum = parseInt(req.query.page,10) || 1; 
        const {search,type} = req.query;
        const PAGE_SIZE = 12; // Maximum number of documents returned at each request
        const skip = (pageNum - 1) * PAGE_SIZE;

        let query = {
            "eventDetails.dateAndTime": {
                $gt: new Date()
            },
            status: "approved"
        }
        if(type) {
            if(type === "free")   
                query["eventDetails.isFree"] = "Yes"
            if(type === "paid")
                query["eventDetails.isFree"] = "No"
        }
        if(search) {
            const regexQuery = new RegExp(search); 
            query["$or"] = [
                {
                    "eventDetails.title": {$regex: regexQuery, $options: "i"}
                },
                {
                    "eventDetails.description": {$regex: regexQuery, $options: "i"}
                },
                {
                    "eventDetails.genre": {$regex: regexQuery, $options: "i"}
                }
            ]            
        }

        const allEvents = await NewEvent.find(query)
            .skip(skip)
            .limit(PAGE_SIZE)
            .sort({updated_at: -1});

        const allEventsCount = await NewEvent.find(query)
            .countDocuments();

        const totalPages = Math.ceil(allEventsCount / PAGE_SIZE); 
        const events = allEvents;

        return res.status(200).json({
            currentPage: pageNum,
            totalPages,
            eventCount: events.length,
            events
        })
    } catch (e) {
        console.log(e);
        return res.status(500).json({error: "Server Error :("});
    }
}

exports.getEventsAuthController = async (req,res) => {
    try {
        const eventType = req.query.type ?? "upcoming";
        const pageNum = parseInt(req.query.page,10) || 1; 
        const PAGE_SIZE = 12; // Maximum number of documents returned at each request
        const skip = (pageNum - 1) * PAGE_SIZE;

        const id = req.body.requestedBy;
        
        let userEvents;
        let userEventsCount;        
        if(eventType === "past") {
            userEvents = await NewEvent.find({
                createdBy: id,
                "eventDetails.dateAndTime": {
                    $lt: new Date()
                }
            }).skip(skip).limit(PAGE_SIZE).sort({updated_at: -1});

            userEventsCount = await NewEvent.find({
                createdBy: id,
                "eventDetails.dateAndTime": {
                    $lt: new Date()
                }
            }).countDocuments();
        } 
        if(eventType === "upcoming") {
            userEvents = await NewEvent.find({
                createdBy: id, 
                "eventDetails.dateAndTime": {
                    $gt: new Date()
                },
                status: "approved"
            }).skip(skip).limit(PAGE_SIZE).sort({updated_at: -1});
    
            userEventsCount = await NewEvent.find({
                createdBy: id, 
                "eventDetails.dateAndTime": {
                    $gt: new Date()
                },
                status: "approved"
            }).countDocuments();
        } 
        if(eventType === "pending") {
            userEvents = await NewEvent.find({
                createdBy: id, 
                "eventDetails.dateAndTime": {
                    $gt: new Date()
                },
                status: "pending"
            }).skip(skip).limit(PAGE_SIZE).sort({updated_at: -1});
    
            userEventsCount = await NewEvent.find({
                createdBy: id, 
                "eventDetails.dateAndTime": {
                    $gt: new Date()
                },
                status: "pending"
            }).countDocuments();
        }         
        const totalPages = Math.ceil(userEventsCount/PAGE_SIZE);

        return res.status(200).json({
            currentPage: pageNum,
            totalPages,
            eventCount: userEvents.length,
            events: userEvents
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({error: "Server Error :("}); 
    }
}

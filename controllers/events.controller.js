const NewEvent = require('../models/events.model');
const { validationResult } = require("express-validator");

exports.createController = async (req,res) => {
    const data = req.body;
    try{
        //NewEvent.eventExists(data);
        const createEvent = new NewEvent(data);
        const created = await createEvent.save();
        return res.status(201).json({message: "Event Created Successfully!", eventData: created})
    } catch(err) {
        console.log(err);
        return res.status(500).json({error: err.message})
    }
}

exports.getEventsController = async (req,res) => {
    try {
        const pageNum = parseInt(req.query.page,10) || 1; 
        const PAGE_SIZE = 12; // Maximum number of documents returned at each request
        const skip = (pageNum - 1) * PAGE_SIZE;
       
        /*
        Returns the number of events (query1) 
        and the event details (query2) 
        that are sheduled after the time at which the request is made
        */
        const queries = await NewEvent.aggregate([
            {
                $facet: {
                    query1: [
                        {
                            $match: { 
                                "eventDetails.dateAndTime": { 
                                    $gt: new Date() 
                                }
                            }
                        },
                        {
                            $count: "totalEvents"
                        }
                    ], 
                    query2: [
                        { 
                            $match: { 
                                "eventDetails.dateAndTime": { 
                                    $gt: new Date() 
                                }
                            } 
                        },
                        { 
                            $skip: skip 
                        },
                        { 
                            $limit: PAGE_SIZE 
                        }
                    ]
                }
            }
        ]);

        const totalPages = Math.ceil(queries[0].query1[0].totalEvents / PAGE_SIZE); 
        const events = queries[0].query2;

        return res.status(200).json({
            currentPage: pageNum,
            totalPages,
            eventCount: events.length,
            events
        })
    } catch (e) {
        console.log(e);
        return res.status(500).json({err: "Server Error :("});
    }
}
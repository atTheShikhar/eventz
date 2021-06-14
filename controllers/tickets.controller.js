const Ticket = require('../models/tickets.model');
const NewEvent = require('../models/events.model');
const Payments = require("../models/payments.model");
const shortid = require('shortid')
const Razorpay = require('razorpay');
const generateTickets = require('../helpers/generateTickets');
require('dotenv').config({
    path: "../configs/config.env"
});

exports.bookFreeTicketsController = async (req,res,next) => {
    try {
        const {isFree} = req.body.eventData.eventDetails;
        // return res.json({status: "OK"});
        
        if(isFree === "Yes") {
            const {requestedBy,eventId,count,totalTickets} = req.body;
            
            const createdTickets = await generateTickets(count,requestedBy,eventId);

            return res.status(200).json({
                message: "Tickets booked successfully!",
                createdTickets: createdTickets
            });
        }
        if(isFree === "No") {
            return next();
        }
        return res.status(500).json({error: "Server Error :("});
    } catch (e) {
        console.log(e);
        return res.status(500).json({error: "Server Error :("});
    }
}
exports.bookPaidTicketsController = async (req,res) => {
    const { price,title } = req.body.eventData.eventDetails;
    const { requestedBy,count,eventId,totalTickets } = req.body;
    const amountInRs = parseInt(price);

    const payment_capture = 1
    const totalAmountInPaise = count * amountInRs * 100;         
    const currency = "INR"
    const description = `${count} ticket purchase for event: ${title}` 
    
    const options = {
        amount: totalAmountInPaise,
        currency,
        receipt: shortid.generate(),
        payment_capture
    }

    try {
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEYID,
            key_secret: process.env.RAZORPAY_KEYSECRET
        })
        const response = await razorpay.orders.create(options);

        const paymentData = {
            order_id: response.id,
            payment_id: "null",
            amount: response.amount,
            amount_paid: response.amount_paid,
            amount_due: response.amount_due,
            currency: response.currency,
            receipt: response.receipt,
            payment_status: "pending",
            user_id: requestedBy,   
            event_id: eventId,
            ticket_count: count,
            description: description
        }
        //Save payment data to database with current status
        const payment = new Payments(paymentData)
        await payment.save();

        return res.status(200).json({
            id: response.id,
            currency: response.currency,
            amount: response.amount,
            description: description
        })
    } catch(e) {
        console.log(e);
        return res.status(500).json({error: "Server Error :("});
    }
}
exports.verifyPaymentController = async (req,res) => {
    const { payment_id,order_id,amount,status } = req.body;
    try {
        if(status==="captured") {
            const paymentDetails = await Payments.findOneAndUpdate({
                order_id,
                amount
            },{
                payment_status: "captured",
                amount_paid: amount,
                amount_due: 0,
                payment_id: payment_id
            });
            const {user_id,event_id,ticket_count} = paymentDetails; 
            //Generate tickets
            const createdTickets = await generateTickets(ticket_count,user_id,event_id);
            return res.status(200).json({
                message: "Tickets booked successfully!",
                createdTickets: createdTickets
            });
        } 
        if(status==="failed") {
            await Payments.findOneAndUpdate({
                order_id,
                amount
            },{
                payment_status: "failed",
                payment_id: payment_id
            }); 
            //Return with payment failed
            return res.status(400).json({error: "Payment failed :("})
        }
        return res.status(400).json({error: "Bad request!"});
    } catch(err) {
        console.log(err);
        return res.status(500).json({error: "Server Error :("});
    }
}
exports.verifyPaymentWebhookController = async (req,res) => {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const { id,order_id,amount,status } = req?.body?.payload?.payment?.entity;

    const crypto = require('crypto');
    const shasum = crypto.createHmac('sha256', secret)
	shasum.update(JSON.stringify(req.body))
	const digest = shasum.digest('hex')

	// console.log(digest, req.headers['x-razorpay-signature'])

    try {
        if ((digest === req.headers['x-razorpay-signature']) && (status==="captured")) {
            // process it
            await Payments.findOneAndUpdate({
                order_id,
                amount
            },{
                payment_status: "captured",
                amount_paid: amount,
                amount_due: 0,
                payment_id: id
            }); 
        } else {
            // pass it
            await Payments.findOneAndUpdate({
                order_id,
                amount
            },{
                payment_status: "failed",
                payment_id: id
            }); 
        }
    } catch(err) {
        console.log(err);
    }
        
    return res.status(200).json({status: "ok"})
}

exports.fetchTicketsController = async (req,res) => {
    try {
        const { requestedBy } = req.body;
        const tickets = await Ticket.find({userId: requestedBy});
        const ticketCount = tickets.length;

        // let uniqueEventIds = [];
        // for(let i=0;i<ticketCount;i++) {
        //     const id = tickets[i].eventId; 
        //     if(i==0) {
        //         uniqueEventIds.push(id);
        //     } else {
        //         if(id != uniqueEventIds[i-1])
        //             uniqueEventIds.push(id);
        //     }
        // }
        let eventDetails = [];
        for(let i=0;i<ticketCount;i++) {
            const ticket = tickets[i];
            const details = await NewEvent.findById(ticket.eventId);
            eventDetails.push(details);
        }

        return res.json({count: ticketCount,tickets,eventDetails});

    } catch(e) {
        console.log(e);
        return res.status(500).json({error: "Server Error :("});
    }
}
const axios = require('axios');
const Messages = require('../models/messages.model');

exports.eventsMetaController = async (req,res) => {
    const genre = [
        "Seminars",
        "Conferences",
        "Trade Shows",
        "Workshops",
        "Webinars",
        "Classes",
        "Summits",
        "Others"
    ];
    const noOfPeople = [
        "Upto 100",
        "Upto 500",
        "Upto 1000",
        "Upto 5000"
    ];
    const timeLimits = ["< 1 Hr","1 Hr","1 Hr 30 Mins","2 Hrs","> 2 Hrs"];
    
    return res.status(200).json({genre,noOfPeople,timeLimits});
}

exports.addressMetaController = async (req,res) => {
    const {get} = req.query;
    if(get==="states") {
        try {
            const response = await axios({
                method: 'get',
                url: 'https://cdn-api.co-vin.in/api/v2/admin/location/states',
                headers: {
                    'accept': 'application/json',
                    'Accept-Language': 'en_US',
                    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
                }
            })
            return res.status(200).json(response.data);
        } catch(e) {
            console.log(e)
            return res.status(500).json({error: "Server Error"})
        }
    }
    if(get==="district") {
        const {state_id} = req.query;
        try {
            const response = await axios({
                method: 'get',
                url: `https://cdn-api.co-vin.in/api/v2/admin/location/districts/${state_id}`,
                headers: {
                    'accept': 'application/json',
                    'Accept-Language': 'en_US',
                    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
                }
            })
            return res.status(200).json(response.data);
        } catch(e) {
            console.log(e)
            return res.status(500).json({error: "Server Error"})
        }
    }
}

exports.messagesController = async (req,res) => {
    const data = req.body;
    try {
        const messages = new Messages(data);
        await messages.save();
        return res.status(200).json({message: "We received you message, Thanks for contacting :)"})
    } catch(err) {
        console.log(err);
        return res.status(500).json({error: "Server Error"})
    }
}

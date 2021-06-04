const axios = require('axios');

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
    //TODO: Implement get states and district logic
    const {get} = req.query;
    return res.status(200).json({});
    if(get==="states") {

    }
    if(get==="district") {

    }
}


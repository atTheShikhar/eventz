const {
    validDate,
    validEmail,
    validNum,
    validString,
    validText
} = require('./validation');

exports.validEvent = [
    validText("eventDetails.title","title",100),
    validString(true,"eventDetails.description","description",2000),
    validString(true,"eventDetails.noOfPeople","No Of People",20),
    validText("eventDetails.genre","genre",50),
    validDate("eventDetails.dateAndTime","Date and Time","past"),
    validString(true,"eventAddress.apartment","Apartment",50),
    validString(true,"eventAddress.street","Street",100),
    validText("eventAddress.district","District",40),
    validNum("eventAddress.pincode","Pincode",6),
    validText("eventAddress.stateName","State Name",100),
    validText("eventAddress.country","Country",100),
    validText("eventOrganiser.organiserName","Organiser Name",50),
    validNum("eventOrganiser.phone","Phone No.",10),
    validEmail("eventOrganiser.email"),
    validString(false,"eventOrganiser.orgName","Organisation Name",100)        
]
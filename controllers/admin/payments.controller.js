const Payments = require('../../models/payments.model');
const User = require('../../models/user.model');

exports.getPaymentsController = async (req,res) => {
    const status = req?.query?.status;
    const eventId = req?.query?.eventId;

    let query = {};
    if(status === 'pending' || status === "captured" || status === "failed") 
        query.payment_status = status;

    if(eventId != null) 
        query.event_id = eventId;


    try {
        const payments = await Payments.find(query);

        let usersData = [];
        for(let i=0;i<payments.length;i++) {
            const payment = payments[i];
            const userInfo = await User.findById(payment.user_id,{name: 1,email: 1,created_at: 1});
            usersData.push(userInfo);
        }

        const paymentData = payments.map((item,idx) => {
            return {
                ...item._doc,
                name: usersData[idx].name.fname + " " + usersData[idx].name.lname,
                email: usersData[idx].email,
                joinedOn: usersData[idx].created_at
            }
        });

        return res.status(200).json(paymentData);
    } catch (e) {
        console.log(e);
        return res.status(500).json({error: "Server Error :("});
    }
}
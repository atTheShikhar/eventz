const Payments = require('../../models/payments.model');
const User = require('../../models/user.model');

exports.getPaymentsController = async (req,res) => {
    const status = req?.query?.type;
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
            const userInfo = await User.findById(payment.user_id,{name: 1,email: 1,
                created_at: 1,imageLocation: 1});
            usersData.push(userInfo);
        }

        const paymentData = payments.map((item,idx) => {
            return {
                ...item._doc,
                amount: (item.amount / 100),
                amount_paid: (item.amount_paid / 100),
                amount_due: (item.amount_due / 100),
                title: item.description.split(': ')[1],
                name: usersData[idx].name.fname + " " + usersData[idx].name.lname,
                email: usersData[idx].email,
                imageLocation: usersData[idx]?.imageLocation,
                joinedOn: usersData[idx].created_at
            }
        });

        return res.status(200).json(paymentData);
    } catch (e) {
        console.log(e);
        return res.status(500).json({error: "Server Error :("});
    }
}
const Payments = require('../../models/payments.model');
const User = require('../../models/user.model');

exports.getPaymentsController = async (req,res) => {
    const status = req?.query?.type;
    const eventId = req?.query?.eventId;
    const userId = req?.query?.userId;
    const search = req?.query?.search;

    let query = {};
    if(status === 'pending' || status === "captured" || status === "failed") 
        query.payment_status = status;

    if(eventId != null) 
        query.event_id = eventId;

    if(userId != null)
        query.user_id = userId;


    try {
        const payments = await Payments.find(query).sort({"updated_at": -1});

        let usersData = [];
        for(let i=0;i<payments.length;i++) {
            const payment = payments[i];
            const userInfo = await User.findById(payment.user_id);
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
        
        if(search) {
            const includesNoCase = (str1,str2) => {
                const lowerStr1 = str1.toLowerCase();
                const lowerStr2 = str2.toLowerCase();
                return lowerStr1.includes(lowerStr2);
            }
            const searchData = paymentData.filter((item,idx) => {
                return (includesNoCase(item?.name,search) || 
                    includesNoCase(item?.email,search) ||
                    includesNoCase(item?.description,search) ||
                    includesNoCase(item?.ticket_count?.toString(),search) ||
                    includesNoCase(item?.amount?.toString(),search)
                )
            });
            return res.status(200).json(searchData);
        }

        return res.status(200).json(paymentData);
    } catch (e) {
        console.log(e);
        return res.status(500).json({error: "Server Error :("});
    }
}
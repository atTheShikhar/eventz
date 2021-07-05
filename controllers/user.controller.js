const User = require('../models/user.model');
const Ticket = require('../models/tickets.model');
const uploadSingle = require('../middlewares/imageUpload');

exports.getUserController = async (req,res) => {
	const id = req.body.requestedBy;
	try {
		const user = await User.findById(id,{hashed_password: 0});
		// console.log(user);	
		return res.status(200).json({user});
	} catch(e) {
		console.log(e);
		return res.status(500).json({error: "Server Error!"});
	}
}

exports.updateUserController = async (req,res) => {
	const id = req.body.requestedBy;
	const { fname,lname } = req.body;
	try {
		const updatedUser = await User.findByIdAndUpdate(
			id,
			{"name.fname": fname,"name.lname": lname},
			{new: true}
		)
		
		return res.status(200).json({message: "Profile Updated Successfully!"})

	} catch(e) {
		console.log(e);
		return res.status(500).json({error: "Server Error!"});
	}
}
exports.uploadProfilePicController = async (req,res) => {
	try {
		const id = req.body.uploadedBy;
		const saveFileName = "user-"+id;
		const upload = uploadSingle('profilePic','public/uploads/users',saveFileName);
        upload(req,res,async function(err) {
            if(err) {
                return res.status(400).json({error: err.message})
            }
            const imageLocation = `/uploads/users/${req.file.filename}`;
            const user = await User.findByIdAndUpdate(id,{"imageLocation": imageLocation});
            return res.status(200).json({message: "Image Uploaded successfully!"});
        });
	} catch(e) {
		console.log(e);
		return res.status(500).json({error: "Server Error!"});
	}
}
exports.changePasswordController = async (req,res) => {
	const id = req.body.requestedBy;
	const {oldPassword,password} = req.body;
	try {
		const msg = await User.changePassword(id,oldPassword,password);				
		return res.status(200).json({message: msg});
	} catch (er) {
		console.log(er);
		return res.status(401).json({error: er.message});
	}
}

//Used by organisers to verify tickets for their events
exports.verifyTicketsController = async (req,res) => {
	const {requestedBy,ticketId,eventId} = req?.body;
	if(requestedBy && ticketId && eventId)	
	{
		try{
			const organiserData = await User.findById(requestedBy);
			if(Boolean(organiserData)) {
				const createdEvents = organiserData?.createdEvents?.map(elem => elem.toString());

				if(createdEvents.includes(eventId)) {
					const ticket = await Ticket.findOneAndUpdate(
						{ ticketId,eventId },{ availed: "Yes" }
					);
					if(Boolean(ticket)) {
						if(ticket?.availed === "No")
							return res.status(200).json({message: "Valid Ticket!"});	
						return res.status(400).json({error: "Ticket Already Availed!"});
					}
					return res.status(402).json({error: "Invalid Ticket!"});
				}

				return res.status(401).json({error: "You are not the organiser of this event!"})	
			}
			return res.status(401).json({error: "Invalid User!"});	
		} catch(e) {
			console.log(er);
			return res.status(500).json({error: "Server Error"});
		}
	} 
	return res.status(400).json({error: "Invalid Request!"})
}

exports.attendanceController = async (req,res) => {
	const eventId = req?.params?.eventId;
	const {organiserId} = req?.body;

    if(eventId == null) {
        return res.status(400).json({error: "Invalid Request!"});
    }

    try {
		const organiserData = await User.findById(organiserId);

		if(Boolean(organiserData)) {
			const createdEvents = organiserData?.createdEvents?.map(elem => elem.toString());

			if(createdEvents.includes(eventId)) {
				const tickets = await Ticket.find({eventId, availed: "Yes"});
				
				if(tickets.length > 0) {
					
					const ticketUsers = [...new Set(tickets.map(item => item.userId.toString()))] 

					let bookingsData = [];
					for(let i=0;i<ticketUsers.length;i++) {
						const userId = ticketUsers[i];
						
						const userData = await User.findById(userId,{
							name: 1,
							email: 1,
							_id: 1,
							imageLocation: 1,
							created_at: 1
						});
						
						const ticketCount = tickets.reduce((count,item) => {
							return (item.userId.toString() === userId) ? ++count : count;
						},0);
						
						const ticketsAndUsers = {
							ticketCount,
							user: userData                    
						}
						bookingsData.push(ticketsAndUsers);
					}
					
					const ticketBookings = bookingsData.map((item) => {
						return {
							ticketCount: item.ticketCount,
							name: item.user.name.fname + " " + item.user.name.lname,
							email: item.user.email,
							_id: item.user._id,
							// imageLocation: item?.user?.imageLocation,
							joinedOn: new Date(item.user.created_at).toDateString()
						}
					});
					
					return res.status(200).json(ticketBookings);
				}
				//No Bookings
				return res.status(200).json([]);
			}
			return res.status(401).json({error: "This is not your event"});
		}
		return res.status(401).json({error: "User not found"});
    } catch(e) {
        console.log(e);
        return res.status(500).json({error: "Server Error :("});
    }
}
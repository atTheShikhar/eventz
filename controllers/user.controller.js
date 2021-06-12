const User = require('../models/user.model');
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
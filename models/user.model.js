const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
    {
        name: {
            fname: {
                type: String,
                required: true,
                trim: true      
            },
            lname: {
                type: String,
                required: false,
                trim: true
            }
        },
        email: {
            type: String,
            required: false,
            lowercase: true,
            unique: true
        },
        hashed_password: {
            type: String,
            required: true           
        },
        imageLocation: {
            type: String,
            required: false
        }
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at"
        }
    }
);

userSchema.virtual("fullName").
    get(function () {
        return this.name.fname + " " + this.name.lname;
    });

userSchema.pre('save',async function(next) {
    const salt = await bcrypt.genSalt();
    this.hashed_password = await bcrypt.hash(this.hashed_password,salt);
    next();
    });

userSchema.statics.login = async function(email,password) {
    const user = await this.findOne({ email });
    if (user) {
        const result = await bcrypt.compare(password,user.hashed_password);
        if(result === true) {
            return user;
        }
        //Password didn't match
        throw Error("Invalid Login or Password");
    }
    //Email didn't match
    throw Error("Invalid Login or Password");
}

userSchema.statics.changePassword = async function(id,oldPassword,password) {
    try {
        const user = await this.findById(id);
        if (user) {
            const result = await bcrypt.compare(oldPassword,user.hashed_password);
            if(result === true) {
                user.hashed_password = password;
                await user.save();
                const successMsg = "Password Updated Successfully!";
                return successMsg;            
            }
            //Password didn't match
            throw Error("Invalid credentials");
        }
        //User doesn't exists
        throw Error("Invalid credentials");
    } catch(e) {
        throw Error("Invalid credentials")   
    }
}

module.exports = mongoose.model('User',userSchema);

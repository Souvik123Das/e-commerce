const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
    username :{
        type : String,
        require : true,
    },
    email :{
        type : String,
        require : true,
    },
    phone :{
        type : String,
        require : true,
    },
    password :{
        type : String,
        require : true,
    },
    isAdmin : {
        type : Boolean,
        default : false,
    },
})

UserSchema.methods.genaratetoken = async function() { 
    try {
        return jwt.sign ({
            userId :  this._id.toString(),
            email : this.email,
            isAdmin : this.isAdmin,
        },
            process.env.JWT_SECRET_KEY,{
                expiresIn: "10d",
            }


        );
    } catch (error) {
        console.error(error);
    }
};


const User = new mongoose.model("User",UserSchema);
module.exports =User;
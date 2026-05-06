const mongoose = require('mongoose');


const UserSchema = mongoose.Schema(
    {
        name : {
            type : String,
            required : [true, "Please provide a name"]
        },
        username : {
            type : String,
            required : [true, "Please provide a username"],
            unique : true,
            index : true
        },
        email : {
            type : String,
            required : [true, "Please provide a email"],
            unique : true
        },
        password : {
            type : String,
            required : [true, "Please provide a password"],
        },
        role : {
            type : String,
            enum : ["user", "host", "admin"],
            default : "user",
        }
    },
    {
        timestamps : true
    }
)

const User = mongoose.model("user", UserSchema);

module.exports = User;
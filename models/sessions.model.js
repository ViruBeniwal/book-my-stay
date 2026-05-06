const mongoose = require('mongoose');

const SessionSchema = mongoose.Schema(
    {
        userId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true,
        },
        token : {
            type : String,
            required : true,
            unique : true
        },
        expiresAt : {
            type : Date,
            required : true
        }
    },
    {
        timestamps : true 
    }
)
const Session = mongoose.model("session", SessionSchema);
module.exports = Session;
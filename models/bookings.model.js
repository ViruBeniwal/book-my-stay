const mogoose = require('mongoose');

const bookingSchema = new mogoose.Schema(
    {
        propertyId : {
            type : mogoose.Schema.Types.ObjectId,
            ref : "Property",               
            required : true,
            index : true
        },
        userId : {
            type : mogoose.Schema.Types.ObjectId,
            ref : "User",
            required : true,
            index : true
        },
        startDate : {
            type : Date,
            required : true
        },
        endDate : {
            type : Date,
            required : true
        }
    },
    {
        timestamps : true
    }
)

const Booking = mogoose.model("booking", bookingSchema);        

module.exports = Booking;   
const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
    {
        title : {
            type : String,
            required : true,
            unique : true
        },
        price : {
            type : Number,
            required : true
        },  
        city : {
            type : String,
            required : true,
            index : true
        },
        address : {
            type : String,
            required : true
        },
        hostId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true
        },
        isActive : {
            type : Boolean,
            default : true
        }
    },
    {
        timestamps : true
    }

)
propertySchema.index({city : 1, isActive : 1});
const Property = mongoose.model("property", propertySchema);

module.exports = Property;
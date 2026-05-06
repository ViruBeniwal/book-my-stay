const Booking = require("../models/bookings.model");
const Property = require("../models/properties.model");

// get all my bookings
const bookings = async (req, res)=>{
    const userId = req.user.userId;

    try{
        const bookings = await Booking.find({userId : userId});
        if(bookings.length === 0) return res.status(404).json({message : "No bookings found"});
        
        let detailedBookings = [];
        for(let booking of bookings){
            const property = await Property.findById(booking.propertyId);
            detailedBookings.push({
                bookingId : booking._id,
                property : {
                    id : property._id,
                    title : property.title,
                    price : property.price,
                    city : property.city,
                    address : property.address
                },
                startDate : booking.startDate,
                endDate : booking.endDate
            })
        }

        res.status(200).json(detailedBookings);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

// book a property
const bookProperty = async (req, res)=>{
    const userId = req.user.userId;
    const role = req.user.role;
    if(role !== "user") return res.status(403).json({message : "Only customers can book properties"});

    const propertyId = req.params.id;
    const {startDate, endDate} = req.body;

    if(new Date(startDate) >= new Date(endDate)) return res.status(400).json({message : "Start date must be before end date"});

    if(new Date(startDate) < new Date()) return res.status(400).json({message : "Start date must be in the future"});

    // end date should be within 3 months from start date
    if(new Date(endDate) > new Date(new Date(startDate).getTime() + 90*24*60*60*1000)) return res.status(400).json({message : "End date must be within 3 months from start date"});

    try{
        const property = await Property.findById(propertyId);
        if(!property || !property.isActive) return res.status(404).json({message : "Property not found"});
        
        const bookings = await Booking.find({propertyId : propertyId});

        for(let booking of bookings){
            if((new Date(startDate) >= booking.startDate && new Date(startDate) <= booking.endDate) || 
            (new Date(endDate) >= booking.startDate && new Date(endDate) <= booking.endDate)){
                return res.status(400).json({message : "Property is already booked for the selected dates"});
            }
        }

        const newBooking = await Booking.create({
            propertyId,
            userId,
            startDate,
            endDate
        })

        res.status(201).json(newBooking);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

// delete a booking 
const deleteBooking = async (req, res)=>{
    const userId = req.user.userId;
    const bookingId = req.params.id;

    try{
        const booking = await Booking.findById(bookingId);

        if(!booking) return res.status(404).json({message : "Booking not found"});

        if(booking.userId.toString() !== userId) return res.status(403).json({message : "You can only delete your own bookings"});

        await Booking.findByIdAndDelete(bookingId);
        res.status(200).json({message : "Booking deleted successfully"});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

module.exports = {
    bookings,
    bookProperty,
    deleteBooking   
}
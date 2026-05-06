const User = require('../models/users.model.js');
const Property = require('../models/properties.model.js');

const getProperties = async (req, res)=>{
    const {city} = req.query;

    try{
        const properties = await Property.find({city : city});
        if(properties.length === 0) return res.status(404).json({message : "No properties found in this city"});
        res.status(200).json(properties);
    } catch (error) {
        res.status(500).json({message : "Error fetching properties"});
    }
}


const getProperty = async (req, res)=>{
    const propertyId = req.params.id;

    try{
        const property = await Property.findById(propertyId);
        if(!property) return res.status(404).json({message : "Property not found"});
        res.status(200).json(property);
    } catch (error) {
        res.status(500).json({message : "Error fetching property"});
    }
}

const createProperty = async (req, res)=>{
    const userId = req.user.userId;
    const {title, price, city, address} = req.body;

    try{
        const property = await Property.create({    
            title,
            price,
            city,
            address,
            hostId : userId
        })
        res.status(201).json(property);
    } catch (error) {
        res.status(500).json({message : "Error creating property"});
    }
}

const updateProperty = async (req, res)=>{
    const propertyId = req.params.id;
    const userId = req.user.userId;
    const {title, price} = req.body;

    try{
        const property = await Property.findById(propertyId);

        if(!property) return res.status(404).json({message : "Property not found"});

        if(property.hostId.toString() !== userId) return res.status(403).json({message : "You are not the host of this property"});

        if(title) property.title = title;
        if(price !== undefined) property.price = price;
        
        await property.save();
        res.status(200).json(property);
    }catch(err){
        res.status(500).json({message : "Error updating property"});
    }
}

const deleteProperty = async (req, res)=>{
    const propertyId = req.params.id;
    const userId = req.user.userId;

    try{
        const property = await Property.findById(propertyId);

        if(!property) return res.status(404).json({message : "Property not found"});

        if(property.hostId.toString() !== userId) return res.status(403).json({message : "You are not the host of this property"});

        await Property.findByIdAndDelete(propertyId);
        res.status(200).json({message : "Property deleted successfully"});
    } catch (error) {
        res.status(500).json({message : "Error deleting property"});
    }
}

module.exports = {
    getProperties,
    getProperty,
    createProperty,
    updateProperty,
    deleteProperty
}   
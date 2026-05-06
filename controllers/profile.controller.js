const Session = require('../models/sessions.model.js');
const User = require('../models/users.model.js');

const getMe = async (req, res)=>{
    const userId = req.user.userId;
    if(!userId) res.send(404).send("No userId");
    try{
        const user = await User.findById(userId);
        res.status(200).json({
            Name : user.name,
            username : user.username,
            email : user.email,
            role : user.role
        })
    }catch(err){
        res.status(400).json({message : err.message});
    }
}   

const updateMe = async (req, res)=>{
    const userId = req.user.userId;

    try{
        // we should only updates these, nothing else
        const allowedFields = ["name", "email"]; 
        const updates = {};
        for(let key of allowedFields){
            if(req.body[key] !== undefined){
                updates[key] = req.body[key];
            }
        }
        const user = await User.findByIdAndUpdate(userId, updates)
        const newUser = await User.findById(userId);
        res.status(200).json({
            name : newUser.name,
            email : newUser.email,
            role : newUser.role,
        });
    }catch(err){
        res.status(400).json({message : err.message});
    }
}

const deleteMe = async (req,res)=>{
    const userId = req.user.userId;

    try{
        const sessions = await Session.deleteMany({userId : userId});
        const user = await User.findByIdAndDelete(userId);

        res.status(200).json({message : "User deleted successfully"});
    }catch(err){
        res.status(400).json({error : err.message, message: "some error occured while deleting"});
    }
}


module.exports = {
    getMe,
    updateMe,
    deleteMe
}
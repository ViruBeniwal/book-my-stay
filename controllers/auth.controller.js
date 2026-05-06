require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users.model.js');
const Session = require('../models/sessions.model.js');

// Signup a user
const signupUser = async (req, res)=>{
    const {name, username, email, password,role} = req.body;

    try{
        // check if the user already exists
        const existingUser = await User.findOne({
            $or : [{email}, {username}]
        });

        if(existingUser) return res.status(400).send("User already exists");

        // hash password 
        const hashedPassword = await bcrypt.hash(password, 10);   

        // crete a new user
        const newUser = await User.create({
            name,
            username, 
            email, 
            password: hashedPassword,
            role
        });
        res.status(200).send(`Signup successfull, ${name}`);

    }catch(err){
        res.status(500).json({message : err.message});
    }
}   


// login 
const loginUser = async (req, res)=>{
    const {username, password} = req.body;

    try{
        // check if username exists
        const user = await User.findOne({username});

        if(!user) return res.status(404).send("user not found");

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) return res.status(401).send("Incorrect password.");

        const accessToken = generateAccessToken({userId : user._id, role : user.role});  
        const refreshToken = generateRefreshToken({userId : user._id, role : user.role});

        const newSession = await Session.create({
            userId : user._id,
            token : refreshToken,
            expiresAt : new Date(Date.now() + 3*24*60*60*1000)
        })
        
        // check if session limits per user
        const MaxSessionsLimit = 3;
        const count = await Session.countDocuments({userId : user._id});
        if(count >= MaxSessionsLimit){
            const sessionsToDelete = await Session.find({ userId: user._id })
            .sort({ createdAt: -1 })
            .skip(MaxSessionsLimit)
            .select('_id');

            await Session.deleteMany({
            _id: { $in: sessionsToDelete }
            });
        }

        res.status(200).json(
            {usernae : username, 
            accessToken : accessToken,
            refreshToken : refreshToken
        });
    }catch(err){
        res.status(400).json({message : err.message});
    }

}

// to get a new access token using refresh token
const refreshAccessToken = async (req,res)=>{
    const authHeader = req.headers['authorization'];
    const oldRefreshToken = authHeader && authHeader.split(' ')[1];

    if(!oldRefreshToken) return res.sendStatus(401);

    const session = await Session.findOne({token : oldRefreshToken});
    
    const currTime = new Date();

    if(!session || currTime > session.expiresAt){
        return res.status(401).json({message : "Session Expired, Login again"});
    }

    let decoded;
    try{
        decoded = jwt.verify(oldRefreshToken, process.env.SECRET_REFRESH_TOKEN);
    }catch(err){
        return res.sendStatus(403);
    }

    if(decoded.user.userId.toString() !== session.userId.toString()){
        return res.sendStatus(403);
    }

    const newAccessToken = generateAccessToken({userId : decoded.user.userId, role : decoded.user.role});
    const newRefreshToken = generateRefreshToken({userId : decoded.user.userId, role : decoded.user.role});

    session.token =  newRefreshToken;
    session.expiresAt = new Date(Date.now() + 3*24*60*60*1000);
    await session.save(); 

    res.status(200).json({
        accessToken : newAccessToken,
        refreshToken : newRefreshToken
    });
}

const logout = async (req, res)=>{
    const {refreshToken} = req.body;
    try{
        
        const result = await Session.deleteOne({token : refreshToken});

        if(result.deletedCount === 0) return res.status(403).json({message: "session not found"});

        res.status(200).send("You are logged out.");
    }catch(err){
        res.status(400).json({message : err.message});
    }
}


function generateAccessToken({userId, role}){
    return jwt.sign({userId : userId, role : role}, process.env.SECRET_ACCESS_TOKEN, {expiresIn : '10m'});
}

function generateRefreshToken({userId, role}){
    return jwt.sign({userId : userId, role : role}, process.env.SECRET_REFRESH_TOKEN);
}

module.exports = {
    signupUser,
    loginUser,
    refreshAccessToken,
    logout
}
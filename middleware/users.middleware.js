require('dotenv').config();
const jwt = require('jsonwebtoken');


const userAuthenticator = (req, res, next)=>{
    const authHeader = req.headers['authorization'];

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({message : "no token provided"})
    }
    const token = authHeader.split(' ')[1];

    if(!token) return res.status(401).json({message:"No token prvoided"});

    try{
        const decoded = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN);

        req.user = decoded;

        next();
    }catch(err){
        res.status(403).json({message : "Invalid token"});
    }
}

module.exports = userAuthenticator;
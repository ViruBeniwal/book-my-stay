

const roleAuthenticator =  (req, res, next)=>{
    const {userId, role} = req.user;

    if(role !== "host") return res.status(403).json({message: "Access denied", role : role});
    next();
}

module.exports = roleAuthenticator;
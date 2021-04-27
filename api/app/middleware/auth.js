const User = require("../models/User");

const auth = async (req,res,next) => {
    const token = req.get('Authorization');
    // console.log('AUTH TOKEN*************** ', token)
    if(!token) {
        // console.log('AUTH TOKEN FIRST IF TOKEN ERROR*************** ', token)
        return res.status(401).send({error: 'No token present'});
    }  
    const user = await User.findOne({token: token}); 
    if(!user) {
        // console.log('AUTH TOKEN USER ERROR *************** ', token)
        return res.status(401).send({error: 'Wrong token!'});
    } 
    req.user = user;
    next();
};
module.exports = auth;
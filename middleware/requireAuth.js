const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model('User');

//Validate that the token is OK by intercepting it before it gets to our routes
module.exports = (req, res, next) => {
    //authorization === 'Bearer myToken'
    const {authorization} = req.headers; 
    if(!authorization) {
        return res.status(401).send({error: 'You must be logged in.'});
    }

    //replace Bearer with an empty string so that token is only equal to the token in the req
    const token = authorization.replace('Bearer ', '');
    jwt.verify(token, 'MY_SECRET_KEY', async (err,payload) => {
        if(err) {
            return res.status(401).send({error: 'You must be logged in.'});
        }

        //Take the userID from the payload and look up the user in our DB
        const {userId} = payload;
        const user = await User.findById(userId);
        req.user = user;
        next();
    }) 
};
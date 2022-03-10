require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = mongoose.model('User');

const router = express.Router();

//Sign a new user up!
router.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = new User({email, password});
        await user.save();

        //Create a JWT then send the token back to the FE
        const token = jwt.sign({userId: user._id}, process.env.MY_SECRET_KEY);
        res.send({token: token});
    } catch (err) {
        console.error(err);
        return res.status(422).send(err.message); 
    }
});

//If the user already exists, sign in
router.post('/signin', async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password) {
        return res.status(422).send({error: 'Must provide email and password'});
    }

    const user = await User.findOne({email});
    if(!user) {
        return res.status(422).send({error: 'Invalid password or email'});
    }

    try {
        await user.comparePassword(password);
        const token = jwt.sign({ userId: user._id}, process.env.MY_SECRET_KE);
        res.send({token});
    } catch (err){
        return res.status(422).send({error: 'Invalid password or email'});
    }
});

module.exports = router;
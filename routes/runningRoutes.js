const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middleware/requireAuth');

const RunRoute = mongoose.model('RunRoute');

const router = express.Router();

router.use(requireAuth);

router.get('/runroutes', async (req, res) => {
    try {
        const runroutes = await RunRoute.find({userId: req.user._id});
        res.send(runroutes);
    } catch(err) {
        res.status(422).send({error: err.message})
    }
    
})

router.get('/runroutes/one', async (req,res) => {
    const {title, distance} = req.query;
    try{
        console.log("TRY")
        const runroute = await RunRoute.findOne({
            title: title,
            distance: distance,
        })
        console.log(runroute)
        res.send(runroute)
    } catch (err) {
        console.log(err)
        res.status(422).send({error: err.message})
    }  
})

router.post('/runroutes', async (req, res) => {
    const { title, distance, startPos, endPos } = req.body;
    if(!title || !distance || !startPos || !endPos) {
        console.log("INPUT WAS WRONG")
        return res.status(422).send({error: 'Request is not valid'})
    }

    try {
        const newRoute = new RunRoute({
            title: title,
            distance: distance,
            startPos: startPos,
            endPos: endPos,
            userId: req.user._id
        })
        await newRoute.save();
        res.send(newRoute);
    } catch (err) {
        console.log(err)
        res.status(422).send({error: err.message})
    }
})

router.delete('/runroutes/:id', async (req, res) => {
    if(!req.params.id) {
        return res.status(422).send({error: "NO ID FOUND WHEN TRYING TO DELETE"})
    }
    try {
        await RunRoute.findByIdAndDelete(req.params.id)
        res.sendStatus(204)
    } catch (err) {
        console.log(err)
        res.status(422).send({error: err.message})
    }
    
})

module.exports = router
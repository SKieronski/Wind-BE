const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middleware/requireAuth');

const RunRoute = mongoose.model('RunRoute');

const router = express.Router();

router.use(requireAuth);

router.get('/runroutes', async (req, res) => {
    const runroutes = await RunRoute.find({userId: req.user._id});

    res.send(runroutes);
})

router.post('/runroutes', async (req, res) => {
    const { title, distance, startPos, endPos } = req.body;
    console.log(req.body);
    if(!title || !distance || !startPos || !endPos) {
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
        res.status(422).send({error: err.message})
    }
})

router.delete('/runroutes/:id', async (req, res) => {
    console.log("DELETING")
    if(!req.params.id) {
        // console.log("NO ID FOUND WHEN TRYING TO DELETE")
        return res.status(422).send({error: "NO ID FOUND WHEN TRYING TO DELETE"})
    }
    try {
        console.log("IN TRY")
        const response = await RunRoute.findByIdAndDelete(req.params.id)
        console.log("DELETED")
        res.sendStatus(204)
    } catch (err) {
        console.log(err)
        res.status(422).send({error: err.message})
    }
    
})

module.exports = router
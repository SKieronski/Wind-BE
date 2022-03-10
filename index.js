require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); //library that helps parse incoming requests


//represents entire application and handles routes
const app = express();

//Below code connects to Wind DB
const mongoUri = process.env.MONGO_URI;
mongoose.connect(mongoUri, {
    //needed to get rid of errors
    useNewUrlParser: true
});
mongoose.connection.on('connected', () => {
    console.log('Connected to mongo instance')
});
//error handling on connecting to DB
mongoose.connection.on('error', (err) => {
    console.error('Error connecting to mongo', err)
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});
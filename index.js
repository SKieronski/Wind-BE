require('dotenv').config();
require('./models/User');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); //library that helps parse incoming requests
const authRoutes = require('./routes/authRoutes')

//represents entire application and handles routes
const app = express();

app.use(bodyParser.json());

app.use(authRoutes);

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

//base route
app.get('/', (req, res) => {
    res.send(`Your email: ${req.user.email}`);
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});
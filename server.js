require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Session = require('./models/sessions.model.js')


const app = express();
const AuthRoutes = require('./routes/auth.route.js');
const ProfileRoutes = require('./routes/profile.route.js');
const PropertyRoutes = require('./routes/properties.route.js');
const BookingRoutes = require('./routes/bookings.route.js');

app.use(express.json());

app.get('/', (req, res)=>{
    res.status(200).send("Welcome to home page.");    
}) 


app.use('/auth', AuthRoutes);

app.use('/profile', ProfileRoutes);

app.use('/properties', PropertyRoutes)

app.use('/bookings', BookingRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log("Connected to database....");

        app.listen(3000, () => {
            console.log("Server is listening on port 3000...");
        });

    }).catch((err) => {
        console.log("Failed to connect to database.");
        console.log(err.message);
    });  
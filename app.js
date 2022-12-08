/*
*************************************************
* Resource name : Main API (Controller)
* Version : 1
* Author  : Baaztech
* URL     : url i.e https://villa-app.herokuapp.com/
*************************************************
*                  Resources
* 1.Users
* 2. Villas
* 3. villasservices
* 4. Favourite villas
* 5. Bookings
*************************************************
*/

const express = require('express');
const app =  express();

//package for mongoose driver
const mongoose = require('mongoose');

//import all routes
const userRoutes = require('./api/v1/routes/users');
const villaRoutes = require('./api/v1/routes/villas/villas');
//villa services
const servicesRoutes = require('./api/v1/routes/villas/villaservices');
//villa favourites
const favouritesRoutes = require('./api/v1/routes/villas/favouriteVillas');
//villa bookings
const bookingsRoutes = require('./api/v1/routes/bookings/bookings');
//villa bookings
const bookingservicesRoutes = require('./api/v1/routes/bookings/bookingServices');
//Guest Reviews
const guestreviewsRoutes = require('./api/v1/routes/reviews/guestReviews');
//villa bookings
const hostreviewsRoutes = require('./api/v1/routes/reviews/hostReviews');
//chats
const chatsRoutes = require('./api/v1/routes/chats/chats');
//support tickets
const ticketsRoutes = require('./api/v1/routes/supportTickets/tickets');

//Reports
const reportsRoutes = require('./api/v1/routes/reports/reports');

//Database Connection
mongoose.connect('mongodb+srv://mdali-devops:'+process.env.MONGO_ATLAS_PW+'@villa-booking-system.k5h7zrv.mongodb.net/?retryWrites=true&w=majority', {
    // useMongoClient: true
    useNewUrlParser: true,
    useUnifiedTopology: true
});


//midlleware
app.use('/uploads/users', express.static('uploads/users'));
app.use('/uploads/villas', express.static('uploads/villas'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());



//For solving CORS Error
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Origin", "Origin, X-Requested-with, Content-Type, Accept, Authorization");

    if(req.method === "OPTIONS")
    {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});



//use routes
app.use('/v1/users', userRoutes);
app.use('/v1/villas', villaRoutes);
app.use('/v1/villas/services', servicesRoutes);
app.use('/v1/villas/favourites', favouritesRoutes);
app.use('/v1/bookings', bookingsRoutes);
app.use('/v1/bookings/services', bookingservicesRoutes);
app.use('/v1/reviews/guest', guestreviewsRoutes);
app.use('/v1/reviews/host', hostreviewsRoutes);
app.use('/v1/chats', chatsRoutes);
app.use('/v1/support/tickets', ticketsRoutes);
app.use('/v1/reports', reportsRoutes);


//Error Handling Starts

//handle 404 errors
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status= 404;
    next(error);
});

//handle other errors
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    });
});


module.exports = app;
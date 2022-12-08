/*
*************************************************
* Resource name : Booking services (Route)
* Version : 1
* Author  : Baaztech
* URL     : https://villa-app.herokuapp.com/v1/users
*************************************************
*                  Methods
* 1. add booking  service => /v1/bookings/services (POST)
* 2. get booking service  =>  /v1/bookings/services/id (GET)
* 3. delete booking service =>  /v1/bookings/services/id (DELETE)
* 4. get all booking services  =>  /v1/bookings/services/getall (GET)
*************************************************
*/


const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const checkAuth = require('../../../middleware/check-auth');

//import models
const User = require('../../models/user');

///booking model
const Booking = require('../../models/bookings/bookings');

///booking services model
const BookingServices = require('../../models/bookings/bookingServices');

/*
****************************
     Booking Services
 ***************************
 */


 //add booking services
 router.post('/',checkAuth, (req, res, next) => {

    /*
    ******************** add villa booking services Method ******************
    */
    const exp = req.userData.exp;
    const userId = req.userData.userId;
    if(exp > 1000) // if user id and token  match
    {
        //Check user availability
        User.find({_id: userId})
        .exec()
        .then( user =>
        {
            const usertype = user[0].usertype;
            if(usertype == 0) //if user is guest
            {

                const bookingservice = new BookingServices({
                    _id: new mongoose.Types.ObjectId(),
                    booking: req.body.booking,
                    service_id: req.body.service_id,
                    date: req.body.date,
                });

                bookingservice
                .save()
                .then(result => {
                    res.status(201).json({
                        message: "Villa Booking Service Added",
                        createdBookingService: result,
                        Request: {
                            type : "GET",
                            description: "GET all services for villa booking",
                            url: "https://villa-app.herokuapp.com/v1/bookings/services/getall"
                        }
                    });
                })
                .catch( err =>{
                    res.status(500).json({
                        error: err,
                        Request : {
                            type: "POST",
                            description: "add new service for villa booking",
                            url: "https://villa-app.herokuapp.com/v1/bookings/services",
                            data: {

                                booking: "booking id",
                                service_id: "service id",
                                date: "26-09-2021",
                            }
                        }
                    });
                });
            }
            else //if user is not Guest
            {
                res.status(401).json({
                    Message : "you are not allowed to access this resource!"
                });
            }
        }
        )
        .catch( err => {
            res.status(404).json({
                error: err,
                Message : "Guest not found"
            });
        });
    }
    else //if user id and token not matched
    {
        res.status(401).json({
            message : "Auth failed, you are not allowed to access this data"
        });
    }
});



//get booking service
router.get('/:serviceId',checkAuth, (req, res, next) => {

    /*
    ******************** get booking service Method ******************
    */

    const serviceId = req.params.serviceId;
    const userId = req.userData.userId;
    const exp = req.userData.exp;
    if(exp > 1000) //if token is not expired
    {
        //check user availability
        User.find({_id: userId})
        .exec()
        .then( user =>{
            if(user[0].usertype === 0) //if it is guest
            {
                BookingServices.find({_id: serviceId})
                .select('_id booking date')
                .populate('service_id', '_id villa service_id price pool_size date')
                .exec()
                .then(service => {
                    if(service)
                    {
                        res.status(200).json({
                            BookingService: service,
                            Request : {
                                type: "DELETE",
                                description: "Delete booking service",
                                url: "https://villa-app.herokuapp.com/v1/bookings/services" + serviceId
                            }
                        });
                    }
                    else
                    {
                        res.status(404).json({
                            message: "No record Found"
                        });
                    }

                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
            }
            else //if it is not host
            {
                res.status(401).json({
                    Message : "you are not allowed to access this resource!"
                });
            }
        })
        .catch( err => {
            res.status(404).json({
                error: err,
                Message : "User not found"
            });
        });

    }
    else
    {
        res.status(401).json({
            Message : "your auth token is expired!"
        });
    }

});




//get all bokoking services (Guest)
router.get('/guest/:bookingId' , checkAuth , (req, res, next) => {

    /*
    ******************** get all booking services  Method ******************
    */
    const userId = req.userData.userId;
    const exp = req.userData.exp;
    const bookingId = req.params.bookingId;

    if(exp > 1000) //if token is not expired
    {
        //check user availability
        User.find({_id: userId})
        .exec()
        .then( user =>{

            if(user[0].usertype === 0) //if it is guest
            {
                BookingServices.find({booking: bookingId})
                .select('_id booking date')
                .populate('service_id', '_id villa service_id price pool_size date')
                .exec()
                .then(bookingservices => {
                    const response = {
                        count: bookingservices.length,
                        bookingservice: bookingservices.map(service => {
                            return {
                                _id : service._id,
                                booking : service.booking,
                                date : service.date,
                                hostservice : service.service_id,
                                request: {
                                    type: 'POST',
                                    url: 'https://villa-app.herokuapp.com/v1/bookings/services'
                                }
                            }
                        })
                    };
                    res.status(200).json(response);
                });
            }
            else
            {
                res.status(401).json({
                    Message : "you are not allowed to access this resource!"
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err,
                message :"guest not found"
            });
        });
    }
    else
    {
        res.status(401).json({
            Message : "your auth token is expired!"
        });
    }
});








//delete booking service
router.delete('/:serviceId', checkAuth ,  (req, res, next) => {
    const serviceId = req.params.serviceId;
    const userId = req.userData.userId;
    const exp = req.userData.exp;

    if(exp > 100) //check if token is not expired
    {
        //Check user availability
        User.find({_id: userId})
        .exec()
        .then( user =>
        {
            const usertype = user[0].usertype;
            if(usertype == 0) //if user is guest
            {
                BookingServices.deleteOne({_id: serviceId})
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: "villa booking service deleted",
                        response: {
                            type: 'POST',
                            description: "add new villa booking service",
                            url: 'https://villa-app.herokuapp.com/v1/bookings/services'
                        }
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
            }
            else //if user is not Guest
            {
                res.status(401).json({
                    Message : "you are not allowed to access this resource!"
                });
            }
        }
        )
        .catch( err => {
            res.status(404).json({
                error: err,
                Message : "Guest not found"
            });
        });
    }
    else
    {
        res.status(401).json({
            message : "your token is expired!"
        });
    }
});


module.exports= router;
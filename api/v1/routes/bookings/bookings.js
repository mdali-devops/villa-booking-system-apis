/*
*************************************************
* Resource name : Bookings (Route)
* Version : 1
* Author  : Baaztech
* URL     : https://villa-app.herokuapp.com/v1/users
*************************************************
*                  Methods
* 1. add new booking request => /v1/bookings (POST)
* 2. Update request status to booking  =>  /v1/bookings/id (Patch)
* 3. Get all bookings for guest  =>  /v1/bookings/userid (GET)
* 4. Get all bookings for villa  =>  /v1/bookings/villaid (GET)
* 4. Get all bookings for host  =>  /v1/bookings/hostid (GET)
*************************************************
*/
const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const checkAuth = require('../../../middleware/check-auth');

//import models
const User = require('../../models/user');
//villa model
const Villa = require('../../models/villas/villa');
///booking model
const Booking = require('../../models/bookings/bookings');
const bookings = require('../../models/bookings/bookings');

/*
****************************
     Bookings
 ***************************
 */


 //add bookings
 router.post('/',checkAuth, (req, res, next) => {

    /*
    ******************** add villa booking Method ******************
    */
    const exp = req.userData.exp;
    const userId = req.userData.userId;
    if(req.body.guest === userId && exp > 1000) // if user id and token  match
    {
        //Check user availability
        User.find({_id: userId})
        .exec()
        .then( user =>
        {
            const usertype = user[0].usertype;
            if(usertype == 0) //if user is guest
            {

                const booking = new Booking({
                    _id: new mongoose.Types.ObjectId(),
                    guest: req.body.guest,
                    villa: req.body.villa,
                    host: req.body.host,
                    guests: req.body.guests,
                    total: req.body.total,
                    rooms: req.body.rooms,
                    status: req.body.status, //0 for request , 1 for waiting guest approval, 2 for active booking , 3 for completed , 4 for cancelled
                    startdate: req.body.startdate,
                    enddate: req.body.enddate,
                    date: req.body.date,
                });

                booking
                .save()
                .then(result => {
                    res.status(201).json({
                        message: "Villa Booking Added",
                        createdBooking: result,
                        Request: {
                            type : "POST",
                            description: "add services for villa booking",
                            url: "https://villa-app.herokuapp.com/v1/bookings/services"
                        }
                    });
                })
                .catch( err =>{
                    res.status(500).json({
                        error: err,
                        Request : {
                            type: "POST",
                            description: "add new villa booking",
                            url: "https://villa-app.herokuapp.com/v1/bookings",
                            data: {

                                guest: "guest id",
                                villa: "villa id",
                                host: "host id",
                                guests: 4,
                                total: 234,
                                rooms: 2,
                                status: 0, //0 for request , 1 for waiting guest approval, 2 for active booking , 3 for completed , 4 for cancelled
                                startdate: "26-09-2021",
                                enddate: "29-09-2021",
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


 //update villa booking status by host
 router.patch('/host/:bookingId',checkAuth, (req, res, next) => {

    /*
    ******************** update villa booking Method ******************
    */

    const bookingId = req.params.bookingId;
    const userId = req.userData.userId;
    const exp = req.userData.exp;
    const updateOps = {};
    if(exp > 1000) //if token is not expired
    {
        var status;

        if(req.body.status === 1)
        {
            status = 1;
        }
        else
        {
            status = 1;
        }

        //check user availability
        User.find({_id: userId})
        .exec()
        .then( host =>{
            if(host[0].usertype === 1) //if it is host
            {
                Booking.updateOne({_id: bookingId} , {$set: {status: status}})
                .exec()
                .then(result => {

                    res.status(200).json({
                        message: "villa booking request status updated successfully"
                    });
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



 //update villa booking status by guest
 router.patch('/guest/:bookingId',checkAuth, (req, res, next) => {

    /*
    ******************** update villa booking Method ******************
    */

    const bookingId = req.params.bookingId;
    const userId = req.userData.userId;
    const exp = req.userData.exp;
    if(exp > 1000) //if token is not expired
    {
        var status =0;

        if(req.body.status === 2)
        {
            status = 2;
        }
        else
        {
            status = 2;
        }

        //check user availability
        User.find({_id: userId})
        .exec()
        .then( guest =>{
            if(guest[0].usertype === 0) //if it is guest
            {
                Booking.updateOne({_id: bookingId} , {$set: {status: status}})
                .exec()
                .then(result => {

                    res.status(200).json({
                        message: "villa booking request status updated successfully"
                    });
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





//get all bookings for guest
router.get('/' , checkAuth , (req, res, next) => {

    /*
    ******************** get all bookings for guest  Method ******************
    */
    const userId = req.userData.userId;
    const exp = req.userData.exp;

    if(exp > 1000) //if token is not expired
    {
        //check user availability
        User.find({_id: userId})
        .exec()
        .then( user =>{
            if(user[0].usertype === 0) //if user is guest
            {
                Booking.find({guest: userId})
                .select('_id guests total rooms status startdate enddate date')
                .populate('villa', '_id is_featured title description location address bedroom bathroom place guests images price date')
                .populate('host', '_id username email phone')
                .exec()
                .then(guestbookings => {
                    const response = {
                        count: guestbookings.length,
                        bookings: guestbookings.map(booking => {
                            return {
                                _id : booking._id,
                                villa : booking.villa,
                                host : booking.host,
                                guests : booking.guests,
                                total : booking.total,
                                rooms : booking.rooms,
                                status : booking.status,
                                startdate : booking.startdate,
                                enddate : booking.enddate,
                                date : booking.date,
                                request: {
                                    type: 'GET',
                                    url: 'https://villa-app.herokuapp.com/v1/bookings/services/guest/bookingId'
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
                error: err
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




//get all bookings for host villa
router.get('/host/:villaId' , checkAuth , (req, res, next) => {

    /*
    ******************** get all bookings for host villa  Method ******************
    */
    const userId = req.userData.userId;
    const exp = req.userData.exp;
    const villaId = req.params.villaId;

    if(exp > 1000) //if token is not expired
    {
        //check user availability
        User.find({_id: userId})
        .exec()
        .then( user =>{
            if(user[0].usertype === 1) //if user is host
            {
                Booking.find({villa: villaId})
                .select('_id guests total rooms status startdate enddate date')
                .populate('villa', '_id is_featured title description location address bedroom bathroom place guests images price date')
                .populate('guest', '_id username email phone')
                .exec()
                .then(guestbookings => {
                    const response = {
                        count: guestbookings.length,
                        bookings: guestbookings.map(booking => {
                            return {
                                _id : booking._id,
                                villa : booking.villa,
                                guest : booking.guest,
                                total : booking.total,
                                guests : booking.guests,
                                rooms : booking.rooms,
                                status : booking.status,
                                startdate : booking.startdate,
                                enddate : booking.enddate,
                                date : booking.date,
                                request: {
                                    type: 'GET',
                                    url: 'https://villa-app.herokuapp.com/v1/bookings/services/guest/bookingId'
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
                error: err
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





//get all bookings for host
router.get('/host' , checkAuth , (req, res, next) => {

    /*
    ******************** get all bookings for host  Method ******************
    */
    const userId = req.userData.userId;
    const exp = req.userData.exp;

    if(exp > 1000) //if token is not expired
    {
        //check user availability
        User.find({_id: userId})
        .exec()
        .then( user =>{
            if(user[0].usertype === 1) //if user is host
            {
                Booking.find({host: userId})
                .select('_id guests total rooms status startdate enddate date')
                .populate('villa', '_id is_featured title description location address bedroom bathroom place guests images price date')
                .populate('guest', '_id username email phone')
                .exec()
                .then(guestbookings => {
                    const response = {
                        count: guestbookings.length,
                        bookings: guestbookings.map(booking => {
                            return {
                                _id : booking._id,
                                villa : booking.villa,
                                guest : booking.guest,
                                guests : booking.guests,
                                total : booking.total,
                                rooms : booking.rooms,
                                status : booking.status,
                                startdate : booking.startdate,
                                enddate : booking.enddate,
                                date : booking.date,
                                request: {
                                    type: 'GET',
                                    url: 'https://villa-app.herokuapp.com/v1/bookings/services/guest/bookingId'
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
                error: err
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




module.exports= router;




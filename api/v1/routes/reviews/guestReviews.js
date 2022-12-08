/*
*************************************************
* Resource name : Guest Reviews (Route)
* Version : 1
* Author  : Baaztech
* URL     : https://villa-app.herokuapp.com/v1/reviews/guest
*************************************************
*                  Methods
* 1. add new guest review => https://villa-app.herokuapp.com/v1/reviews/guest (POST)
* 2. get single guest review  =>  https://villa-app.herokuapp.com/v1/reviews/guest/single/reviewId (GET)
* 3. Get all guest reviews => https://villa-app.herokuapp.com/v1/reviews/guest/getall (GET)
* 4. Get guest review using booking Id => https://villa-app.herokuapp.com/v1/reviews/guest/booking/bookingId (GET)
*************************************************
*/
const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const checkAuth = require('../../../middleware/check-auth');

//import models
const User = require('../../models/user');
const guestReviews = require('../../models/Reviews/guestReviews');


/*
****************************
     Guest Reviews
 ***************************
 */



 //add add guest review
 router.post('/',checkAuth, (req, res, next) => {

    /*
    ******************** add guest review Method ******************
    */
    const exp = req.userData.exp;
    const userId = req.userData.userId;
    if(exp > 1000) // if token is valid
    {
        //Check user availability
        User.find({_id: userId})
        .exec()
        .then( user =>
        {
            const usertype = user[0].usertype;
            if(usertype == 1) //if user is host
            {

                const guestreview = new guestReviews({
                    _id: new mongoose.Types.ObjectId(),
                    guest: req.body.guest,
                    host: userId,
                    booking: req.body.booking,
                    villa: req.body.villa,
                    comment: req.body.comment,
                    rating: req.body.rating,
                    date: req.body.date
                });

                guestreview
                .save()
                .then(result => {
                    res.status(201).json({
                        message: "Guest Review Added",
                        createdReview: result,
                        Request: {
                            type : "GET",
                            description: "GET Single guest review",
                            url: "https://villa-app.herokuapp.com/v1/reviews/guest/single"
                        }
                    });
                })
                .catch( err =>{
                    res.status(500).json({
                        error: err,
                        Request : {
                            type: "POST",
                            description: "add new guest review",
                            url: "https://villa-app.herokuapp.com/v1/reviews/guest"
                        }
                    });
                });
            }
            else //if user is not host
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
                Message : "Host not found"
            });
        });
    }
    else //if token expired
    {
        res.status(401).json({
            message : "Auth failed, your token is expired"
        });
    }
});



//GET single guest review
router.get('/single/:reviewId',checkAuth, (req, res, next) => {

    const userId = req.userData.userId;
    const exp = req.userData.exp;
    reviewId = req.params.reviewId;

    if(exp > 1000) // if token is valid
    {
        //Check user availability
        User.find({_id: userId})
        .exec()
        .then( user =>
        {


            if(user) //if user exist
            {
                guestReviews.find({_id: reviewId})
                .select('_id comment rating date')
                .populate('host', '_id username phone email')
                .populate('guest', '_id username phone email')
                .exec()
                .then(review => {
                    if(review)
                    {
                        res.status(200).json({
                            review: review,
                            Request : {
                                type: "GET",
                                description: "Get all reviews for guest",
                                url: "https://villa-app.herokuapp.com/v1/reviews/guest/getall"
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
            else //if user is not available
            {
                res.status(401).json({
                    Message : "user not found!"
                });
            }
        }
        )
        .catch( err => {
            res.status(404).json({
                error: err,
                Message : "user not found"
            });
        });
    }
    else //if token expired
    {
        res.status(401).json({
            message : "Auth failed, your token is expired"
        });
    }
 });


//get all reviews for guest using guestId villas
router.get('/getall/:guestId' , checkAuth , (req, res, next) => {

    /*
    ******************** get all reviews for guest  Method ******************
    */
    const userId = req.userData.userId;
    const exp = req.userData.exp;
    const guestId = req.params.guestId;
    if(exp > 1000) //if token is not expired
    {
        //check user availability
        User.find({_id: userId})
        .exec()
        .then( user =>{

            guestReviews.find({guest: guestId})
            .select('_id comment rating date')
            .populate('host', '_id username phone email')
            .populate('guest', '_id username phone email')
            .exec()
            .then(reviews => {
                const response = {
                    count: reviews.length,
                    guestreviews: reviews.map(review => {
                        return {
                            _id : review._id,
                            host : review.host,
                            guest : review.guest,
                            comment : review.comment,
                            rating : review.rating,
                            date : review.date,
                            request: {
                                type: 'GET',
                                url: 'https://villa-app.herokuapp.com/v1/reviews/guest/' + review._id
                            }
                        }
                    })
                };
                res.status(200).json(response);
            });
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


//get all guest reviews using booking Id \
router.get('/booking/:bookingId' , checkAuth , (req, res, next) => {

    /*
    ******************** get all reviews for guest using booking Id  Method ******************
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

            guestReviews.find({booking: bookingId})
            .select('_id comment rating date')
            .populate('host', '_id username phone email')
            .populate('guest', '_id username phone email')
            .exec()
            .then(reviews => {
                const response = {
                    count: reviews.length,
                    guestreviews: reviews.map(review => {
                        return {
                            _id : review._id,
                            host : review.host,
                            guest : review.guest,
                            comment : review.comment,
                            rating : review.rating,
                            date : review.date,
                            request: {
                                type: 'GET',
                                url: 'https://villa-app.herokuapp.com/v1/reviews/guest/' + review._id
                            }
                        }
                    })
                };
                res.status(200).json(response);
            });
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



//get ratings for guest
router.get('/ratings/:guestId' , checkAuth , (req, res, next) => {

    /*
    ******************** get guest ratings  Method ******************
    */
    const userId = req.userData.userId;
    const exp = req.userData.exp;
    const guestId = req.params.guestId;
    if(exp > 1000) //if token is not expired
    {
        //check user availability
        User.find({_id: userId})
        .exec()
        .then( user =>{

            guestReviews.find({guest: guestId})
            .select('rating')
            .exec()
            .then(ratings => {
                const response = {
                    count: ratings.length,
                    guestratings: ratings.map(rating => {
                        return {
                            rating : rating.rating,
                            request: {
                                type: 'GET',
                                url: 'https://villa-app.herokuapp.com/v1/reviews/guest/getall/guestId'
                            }
                        }
                    })
                };
                res.status(200).json(response);
            });
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
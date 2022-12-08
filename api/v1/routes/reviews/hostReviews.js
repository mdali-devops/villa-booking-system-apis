/*
*************************************************
* Resource name : Host Reviews (Route)
* Version : 1
* Author  : Baaztech
* URL     : https://villa-app.herokuapp.com/v1/reviews/host
*************************************************
*                  Methods
* 1. add new host review => https://villa-app.herokuapp.com/v1/reviews/host (POST)
* 2. get single host review  =>  https://villa-app.herokuapp.com/v1/reviews/host/single/reviewId (GET)
* 3. Get all host reviews => https://villa-app.herokuapp.com/v1/reviews/host/getall (GET)
* 4. Get host reviews using booking Id => https://villa-app.herokuapp.com/v1/reviews/host/booking/bookingId (GET)
* 5. Get reviews using villa Id => https://villa-app.herokuapp.com/v1/reviews/host/villa/villaId (GET)
*************************************************
*/

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const checkAuth = require('../../../middleware/check-auth');

//import models
const User = require('../../models/user');
const hostReviews = require('../../models/Reviews/hostReviews');


/*
****************************
     Host Reviews
 ***************************
 */



 //add add host review
 router.post('/',checkAuth, (req, res, next) => {

    /*
    ******************** add host review Method ******************
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
            if(usertype == 0) //if user is guest
            {

                const hostreview = new hostReviews({
                    _id: new mongoose.Types.ObjectId(),
                    guest: req.body.guest,
                    host: userId,
                    booking: req.body.booking,
                    villa: req.body.villa,
                    comment: req.body.comment,
                    rating: req.body.rating,
                    date: req.body.date
                });

                hostreview
                .save()
                .then(result => {
                    res.status(201).json({
                        message: "Host Review Added",
                        createdReview: result,
                        Request: {
                            type : "GET",
                            description: "GET Single host review",
                            url: "https://villa-app.herokuapp.com/v1/reviews/host/single"
                        }
                    });
                })
                .catch( err =>{
                    res.status(500).json({
                        error: err,
                        Request : {
                            type: "POST",
                            description: "add new host review",
                            url: "https://villa-app.herokuapp.com/v1/reviews/host"
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



//GET single host review
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
                hostReviews.find({_id: reviewId})
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
                                description: "Get all reviews for host",
                                url: "https://villa-app.herokuapp.com/v1/reviews/host/getall"
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


//get all reviews for host using hostId
router.get('/getall/:hostId' , checkAuth , (req, res, next) => {

    /*
    ******************** get all reviews for host  Method ******************
    */
    const userId = req.userData.userId;
    const exp = req.userData.exp;
    const guestId = req.params.hostId;
    if(exp > 1000) //if token is not expired
    {
        //check user availability
        User.find({_id: userId})
        .exec()
        .then( user =>{

            hostReviews.find({host: guestId})
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
                                url: 'https://villa-app.herokuapp.com/v1/reviews/host/' + review._id
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


//get all host reviews using booking Id \
router.get('/booking/:bookingId' , checkAuth , (req, res, next) => {

    /*
    ******************** get all reviews for host using booking Id  Method ******************
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

            hostReviews.find({booking: bookingId})
            .select('_id comment rating date')
            .populate('host', '_id username phone email')
            .populate('guest', '_id username phone email')
            .exec()
            .then(reviews => {
                const response = {
                    count: reviews.length,
                    hostreviews: reviews.map(review => {
                        return {
                            _id : review._id,
                            host : review.host,
                            guest : review.guest,
                            comment : review.comment,
                            rating : review.rating,
                            date : review.date,
                            request: {
                                type: 'GET',
                                url: 'https://villa-app.herokuapp.com/v1/reviews/host/' + review._id
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





//get all villa reviews using villa Id \
router.get('/villa/:villaId' , checkAuth , (req, res, next) => {

    /*
    ******************** get all reviews for villa using villa Id  Method ******************
    */
    const userId = req.userData.userId;
    const exp = req.userData.exp;
    const bookingId = req.params.villaId;
    if(exp > 1000) //if token is not expired
    {
        //check user availability
        User.find({_id: userId})
        .exec()
        .then( user =>{

            hostReviews.find({villa: bookingId})
            .select('_id comment rating date')
            .populate('host', '_id username phone email')
            .populate('guest', '_id username phone email')
            .exec()
            .then(reviews => {
                const response = {
                    count: reviews.length,
                    villareviews: reviews.map(review => {
                        return {
                            _id : review._id,
                            host : review.host,
                            guest : review.guest,
                            comment : review.comment,
                            rating : review.rating,
                            date : review.date,
                            request: {
                                type: 'GET',
                                url: 'https://villa-app.herokuapp.com/v1/reviews/host/' + review._id
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



//get ratings for host
router.get('/ratings/:hostId' , checkAuth , (req, res, next) => {

    /*
    ******************** get host ratings  Method ******************
    */
    const userId = req.userData.userId;
    const exp = req.userData.exp;
    const guestId = req.params.hostId;
    if(exp > 1000) //if token is not expired
    {
        //check user availability
        User.find({_id: userId})
        .exec()
        .then( user =>{

            hostReviews.find({host: guestId})
            .select('rating')
            .exec()
            .then(ratings => {
                const response = {
                    count: ratings.length,
                    hostratings: ratings.map(rating => {
                        return {
                            rating : rating.rating,
                            request: {
                                type: 'GET',
                                url: 'https://villa-app.herokuapp.com/v1/reviews/host/getall/hostId'
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



//get ratings for villas
router.get('/villa/rating/:villaId' , checkAuth , (req, res, next) => {

    /*
    ******************** get villa ratings  Method ******************
    */
    const userId = req.userData.userId;
    const exp = req.userData.exp;
    const guestId = req.params.villaId;
    if(exp > 1000) //if token is not expired
    {
        //check user availability
        User.find({_id: userId})
        .exec()
        .then( user =>{

            hostReviews.find({villa: guestId})
            .select('rating')
            .exec()
            .then(ratings => {
                const response = {
                    count: ratings.length,
                    villaratings: ratings.map(rating => {
                        return {
                            rating : rating.rating,
                            request: {
                                type: 'GET',
                                url: 'https://villa-app.herokuapp.com/v1/reviews/host/getall/hostId'
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
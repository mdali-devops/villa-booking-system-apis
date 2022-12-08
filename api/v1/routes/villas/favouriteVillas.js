/*
*************************************************
* Resource name : Favourite Villas for Guest (Route)
* Version : 1
* Author  : Baaztech
* URL     : https://villa-app.herokuapp.com/v1/villas
*************************************************
*                  Methods
* 1. add villa to favourites => /v1/villas/favourites (POST)
* 2. get favourite villas for guest  =>  /v1/villas/favourites (GET)
* 3. delete villa from favourites =>  /v1/villas/favourites/id (DELETE)
*************************************************
*/
const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const checkAuth = require('../../../middleware/check-auth');

//import models
const User = require('../../models/user');
//villa model
const Villa = require('../villas/villas');

//guest favourite villas model
const FavouriteVillas = require('../../models/villas/favourites');




/*
 ***************************************
 ********** Favourite Villas (Guest) ****
 **************************************
*/

router.post('/',checkAuth, (req, res, next) => {

    /*
    ******************** add villa to favourites Method ******************
    */

    const userId = req.userData.userId;
    const exp = req.userData.exp;
    if(exp > 1000) // if token  match
    {
        //Check user availability
        User.find({_id: userId})
        .exec()
        .then( user => {
            if(user[0].usertype === 0) //if user is not guest
            {
                const favourite = new FavouriteVillas({
                    _id: new mongoose.Types.ObjectId(),
                    guest: req.body.guest,
                    villa: req.body.villa,
                    date: req.body.date
                });

                favourite
                .save()
                .then(result => {
                    res.status(201).json({
                        message: "Villa Added to Favourites",
                        FavouriteVilla: result,
                        Request: {
                            type : "GET",
                            description: "GET Favourite villas",
                            url: "https://villa-app.herokuapp.com/v1/villas/favourites/" + result._id
                        }
                    });
                })
                .catch( err =>{
                    res.status(500).json({
                        error: err,
                        Request : {
                            type: "POST",
                            description: "add villa to favourites",
                            url: "https://villa-app.herokuapp.com/v1/villas/favourites",
                            data: {
                                guest: "guest id",
                                villa: "villa id",
                                date: "21-09-2021"
                            }
                        }
                    });
                });
            }
            else // if user is not guest
            {
                res.status(401).json({
                    message : "Forbidden, user is not guest"
                });
            }
        })
        .catch( err => {
            res.status(404).json({
                error: err,
                Message : "Guest User Not Found"
            });
        });
    }
    else //if token expired matched
    {
        res.status(401).json({
            message : "Auth failed, token expired"
        });
    }
});





//get all favourite villas
router.get('/getall' , checkAuth , (req, res, next) => {

    /*
    ******************** get all favourite villas  Method ******************
    */
    const userId = req.userData.userId;
    const exp = req.userData.exp;

    if(exp > 1000) //if token is not expired
    {
        //check user availability
        User.find({_id: userId})
        .exec()
        .then( user =>{

            FavouriteVillas.find({guest: userId})
            .select('_id date')
            .populate('villa', '_id is_featured title description location address bedroom bathroom place guests images price date')
            .exec()
            .then(guestfavourites => {
                const response = {
                    count: guestfavourites.length,
                    favourites: guestfavourites.map(favourite => {
                        return {
                            _id : favourite._id,
                            date : favourite.date,
                            villa: favourite.villa,
                            request: {
                                type: 'DELETE',
                                url: 'https://villa-app.herokuapp.com/v1/villas/favourites/' + favourite._id
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






//delete villa from favourites
router.delete('/:villaId',checkAuth, (req, res, next) => {

    /*
    ******************** delete villa from favourites Method ******************
    */


    const villaId = req.params.villaId;
    const userId = req.userData.userId;
    const exp = req.userData.exp;
    if(exp > 1000) //if token is not expired
    {
        //check user availability
        User.find({_id: userId})
        .exec()
        .then( guest =>{
            if(guest[0].usertype === 0) //if it is guest
            {
                FavouriteVillas.deleteOne({villa: villaId})
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: "villa removed from favourites",
                        response: {
                            type: 'POST',
                            description: "add villa to favourites",
                            url: 'https://villa-app.herokuapp.com/v1/villas/favourites'
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



module.exports= router;

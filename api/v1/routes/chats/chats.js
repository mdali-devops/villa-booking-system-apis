/*
*************************************************
* Resource name : Chats (Route)
* Version : 1
* Author  : Baaztech
* URL     : https://villa-app.herokuapp.com/v1/chats
*************************************************
*                  Methods
* 1. add new chat => /v1/chats/guest (POST)
* 2. get single chat  => /v1/chats/chatId (GET)
* 3. Get guest all chats => /v1/chats/guest/getall/guestId (GET)
* 4. Get host all chats => /v1/chats/host/getall/hostId (GET)
**************************************************************
*************  chat messages ***********************
* 1. add new chat message => /v1/chats/chatmessage (POST)
* 2. get single chat message => /v1/chats/chatmessage/chatmessageId (GET)
* 3. Get all chat messages => /v1/chats/chatmessage/getall/chatId (GET)
*************************************************
*/

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const checkAuth = require('../../../middleware/check-auth');

//import models
const User = require('../../models/user');
const Chats = require('../../models/chats/chat');
const ChatMessages = require('../../models/chats/chatMessages');


/*
****************************
     Chats
 ***************************
 */



//add new chat
router.post('/guest',checkAuth, (req, res, next) => {

    /*
    ******************** add new chat Method ******************
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
                //token  guestId + hostId
                const token = userId + req.body.host;

                const chat = new Chats({
                    _id: new mongoose.Types.ObjectId(),
                    guest: userId,
                    host: req.body.host,
                    booking: req.body.booking,
                    token: token,
                    date: req.body.date
                });

                chat
                .save()
                .then(result => {
                    res.status(201).json({
                        message: "Chat initiated",
                        createdChat: result,
                        Request: {
                            type : "GET",
                            description: "GET single chat",
                            url: "https://villa-app.herokuapp.com/v1/chats/chatId"
                        }
                    });
                })
                .catch( err =>{
                    res.status(500).json({
                        error: err,
                        Request : {
                            type: "POST",
                            description: "add new chat",
                            url: "https://villa-app.herokuapp.com/v1/chats/guest"
                        }
                    });
                });
            }
            else //if user is not guest
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




//Check chat availability
router.get('/availability/:hostId',checkAuth, (req, res, next) => {

    const userId = req.userData.userId;
    const exp = req.userData.exp;
    hostId = req.params.hostId;

    if(exp > 1000) // if token is valid
    {
        //Check user availability
        User.find({_id: userId})
        .exec()
        .then( user =>
        {


            if(user) //if user exist
            {
                const token = userId + req.body.host;
                Chats.find({token: token})
                .select('_id token date')
                .exec()
                .then(chat => {
                    if(chat._id != undefined)
                    {
                        res.status(200).json({
                            chat: chat,
                            Request : {
                                type: "PATCH",
                                description: "update chat booking",
                                url: "https://villa-app.herokuapp.com/v1/chats/guest/" + chat._id
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








//GET single chat
router.get('/:chatId',checkAuth, (req, res, next) => {

    const userId = req.userData.userId;
    const exp = req.userData.exp;
    chatId = req.params.chatId;

    if(exp > 1000) // if token is valid
    {
        //Check user availability
        User.find({_id: userId})
        .exec()
        .then( user =>
        {


            if(user) //if user exist
            {
                Chats.find({_id: chatId})
                .select('_id token date')
                .populate('host', '_id username phone email')
                .populate('guest', '_id username phone email')
                .exec()
                .then(chat => {
                    if(chat)
                    {
                        res.status(200).json({
                            chat: chat,
                            Request : {
                                type: "GET",
                                description: "Get all chat messages",
                                url: "https://villa-app.herokuapp.com/v1/chats/chatmessage/getall/" + chatId
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





//get all chats for guest
router.get('/guest/getall/:guestId' , checkAuth , (req, res, next) => {

    /*
    ******************** get all chats for guest  Method ******************
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
            if(user[0].usertype === 0 )
            {
                Chats.find({guest: guestId})
                .select('_id token date')
                .populate('host', '_id username phone email')
                .populate('guest', '_id username phone email')
                .exec()
                .then(guestchats => {
                    const response = {
                        count: guestchats.length,
                        guestchats: guestchats.map(guestchat => {
                            return {
                                _id : guestchat._id,
                                host : guestchat.host,
                                guest : guestchat.guest,
                                token : guestchat.token,
                                date : guestchat.date,
                                request: {
                                    type: 'GET',
                                    description: "get all chat messages",
                                    url: 'https://villa-app.herokuapp.com/v1/chats/chatmessage/getall/' + guestchat._id
                                }
                            }
                        })
                    };
                    res.status(200).json(response);
                });
            }
            else
            {
                res.status(404).json({
                    message : "user is not guest"
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





//update chat booking
router.patch('/guest/update' , checkAuth , (req, res, next) => {

    /*
    ******************** update chat booking  Method ******************
    */
    const userId = req.userData.userId;
    const exp = req.userData.exp;
    // const chatId = req.params.chatId;
    if(exp > 1000) //if token is not expired
    {
        //check user availability
        User.find({_id: userId})
        .exec()
        .then( user =>{
            if(user[0].usertype === 0 )
            {
                Chats.updateOne({_id: req.body.chatId} , {$set: {booking : req.body.booking}})
                        .exec()
                        .then(result => {

                            res.status(200).json({
                                message: "Chat booking updated successfully",
                                response : {
                                    type : "GET",
                                    url : "https://villa-app.herokuapp.com/v1/chats/chatId"
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
            else
            {
                res.status(404).json({
                    message : "user is not guest"
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




//get all chats for host
router.get('/host/getall/:hostId' , checkAuth , (req, res, next) => {

    /*
    ******************** get all chats for host  Method ******************
    */
    const userId = req.userData.userId;
    const exp = req.userData.exp;
    const hostId = req.params.hostId;
    if(exp > 1000) //if token is not expired
    {
        //check user availability
        User.find({_id: userId})
        .exec()
        .then( user =>{
            if(user[0].usertype === 1 )
            {
                Chats.find({host: hostId})
                .select('_id token date')
                .populate('host', '_id username phone email')
                .populate('guest', '_id username phone email')
                .exec()
                .then(hostchats => {
                    const response = {
                        count: hostchats.length,
                        hostchats: hostchats.map(hostchat => {
                            return {
                                _id : hostchat._id,
                                host : hostchat.host,
                                guest : hostchat.guest,
                                token : hostchat.token,
                                date : hostchat.date,
                                request: {
                                    type: 'GET',
                                    description: "get all chat messages",
                                    url: 'https://villa-app.herokuapp.com/v1/chats/chatmessage/getall/' + hostchat._id
                                }
                            }
                        })
                    };
                    res.status(200).json(response);
                });
            }
            else
            {
                res.status(404).json({
                    message : "user is not host"
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




/*
*************************************************************************
***************  chat messages
*************************************************************************
*/



//add new chatmessage
router.post('/chatmessage',checkAuth, (req, res, next) => {

    /*
    ******************** add new chat message Method ******************
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

                const chatmessage = new ChatMessages({
                    _id: new mongoose.Types.ObjectId(),
                    user: req.body.userId,
                    usertype: usertype,
                    chat: req.body.chat,
                    message: req.body.message,
                    time: req.body.time,
                    date: req.body.date
                });

                chatmessage
                .save()
                .then(result => {
                    res.status(201).json({
                        message: "Chat message added",
                        createdChatMessage: result,
                        Request: {
                            type : "GET",
                            description: "GET single chatmessage",
                            url: "https://villa-app.herokuapp.com/v1/chats/chatmessage/"
                        }
                    });
                })
                .catch( err =>{
                    res.status(500).json({
                        error: err,
                        Request : {
                            type: "POST",
                            description: "add new chatmessage",
                            url: "https://villa-app.herokuapp.com/v1/chats/chatmessage"
                        }
                    });
                });

        }
        )
        .catch( err => {
            res.status(404).json({
                error: err,
                Message : "User not found"
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





//GET single chatmessage
router.get('/chatmessage/:chatmessageId',checkAuth, (req, res, next) => {

    const userId = req.userData.userId;
    const exp = req.userData.exp;
    chatmessageId = req.params.chatmessageId;

    if(exp > 1000) // if token is valid
    {
        //Check user availability
        User.find({_id: userId})
        .exec()
        .then( user =>
        {


            if(user) //if user exist
            {
                ChatMessages.find({_id: chatmessageId})
                .select('_id usertype chat message time date')
                .populate('user', '_id username phone email')
                .exec()
                .then(chatmessage => {
                    if(chatmessage)
                    {
                        res.status(200).json({
                            chatmessage: chatmessage,
                            Request : {
                                type: "GET",
                                description: "Get all chat messages",
                                url: "https://villa-app.herokuapp.com/v1/chats/chatmessage/getall/" + chatmessage.chat
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





 //get all chatmessages
router.get('/chatmessage/getall/:chatId' , checkAuth , (req, res, next) => {

    /*
    ******************** get all chatmessages  Method ******************
    */
    const userId = req.userData.userId;
    const exp = req.userData.exp;
    const chatId = req.params.chatId;
    if(exp > 1000) //if token is not expired
    {
        //check user availability
        User.find({_id: userId})
        .exec()
        .then( user =>{

                ChatMessages.find({chat: chatId})
                .select('_id usertype chat message time date')
                .populate('user', '_id username phone email')
                .exec()
                .then(chatmessages => {
                    const response = {
                        count: chatmessages.length,
                        chatmessages: chatmessages.map(chatmessage => {
                            return {
                                _id : chatmessage._id,
                                usertype : chatmessage.usertype,
                                chat : chatmessage.chat,
                                message : chatmessage.message,
                                time : chatmessage.time,
                                date : chatmessage.date,
                                user: chatmessage.user,
                                request: {
                                    type: 'GET',
                                    description: "get single chat message",
                                    url: 'https://villa-app.herokuapp.com/v1/chats/chatmessage/' + chatmessage._id
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

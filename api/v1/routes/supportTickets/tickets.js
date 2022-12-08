/*
*************************************************
* Resource name : Tickets (Route)
* Version : 1
* Author  : Baaztech
* URL     : https://villa-app.herokuapp.com/v1/chats
*************************************************
*                  Methods
* 1. add new ticket => /v1/support/tickets (POST)
* 2. get single ticket  => /v1/support/tickets/ticketId (GET)
* 3. Get all tickets => /v1/support/tickets/getall/userId (GET)
* 4. update ticket status => /v1/support/tickets/ticketId (Patch)
**************************************************************
*************  chat messages ***********************
* 1. add new ticket nessage => /v1/support/tickets/messages (POST)
* 2. get single ticket message  => /v1/support/tickets/messages/messageId (GET)
* 3. Get all ticket messages  => /v1/support/tickets/messages/getall/ticketId (GET)
*************************************************
*/

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const checkAuth = require('../../../middleware/check-auth');

//import models
const User = require('../../models/user');
const Tickets = require('../../models/supportTickets/tickets');
const TicketMessages = require('../../models/supportTickets/ticketMessages');


/*
****************************
     Tickets
 ***************************
 */



//add new Ticket
router.post('/',checkAuth, (req, res, next) => {

    /*
    ******************** add new ticket Method ******************
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
            if(usertype == 0 || usertype === 1) //if user is guest or host
            {
                //ticket number
                let ticketno = '';
                for (let i = 0; i < 8; ++i) {
                    ticketno += userId.charAt(Math.floor(Math.random() * userId.length));
                }

                const ticket = new Tickets({
                    _id: new mongoose.Types.ObjectId(),
                    ticketnumber: ticketno,
                    user: req.userData.userId,
                    reason: req.body.reason,
                    title: req.body.title,
                    description: req.body.description,
                    status: req.body.status, //0 for open, 1 for closed
                    date: req.body.date
                });

                ticket
                .save()
                .then(result => {
                    res.status(201).json({
                        message: "Ticket generated",
                        createdTicket: result,
                        Request: {
                            type : "GET",
                            description: "GET single ticket",
                            url: "https://villa-app.herokuapp.com//v1/support/tickets"
                        }
                    });
                })
                .catch( err =>{
                    res.status(500).json({
                        error: err,
                        Request : {
                            type: "POST",
                            description: "add new ticket",
                            url: "https://villa-app.herokuapp.com/v1/support/tickets"
                        }
                    });
                });
            }
            else //if user is niether guest nor host
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





//GET single ticket
router.get('/:ticketId',checkAuth, (req, res, next) => {

    const userId = req.userData.userId;
    const exp = req.userData.exp;
    chatId = req.params.ticketId;

    if(exp > 1000) // if token is valid
    {
        //Check user availability
        User.find({_id: userId})
        .exec()
        .then( user =>
        {


            if(user) //if user exist
            {
                Tickets.find({_id: chatId})
                .select('_id ticketnumber user reason title description status date')
                .populate('user', '_id username phone email')
                .exec()
                .then(ticket => {
                    if(ticket)
                    {
                        res.status(200).json({
                            Ticket: ticket,
                            Request : {
                                type: "POST",
                                description: "add new ticket message ",
                                url: "https://villa-app.herokuapp.com/v1/support/tickets/messages"
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





//get all tickets
router.get('/getall/:userId' , checkAuth , (req, res, next) => {

    /*
    ******************** get all tickets  Method ******************
    */
    const userId = req.userData.userId;
    const exp = req.userData.exp;
    const guestId = req.params.userId;
    if(exp > 1000) //if token is not expired
    {
        //check user availability
        User.find({_id: userId})
        .exec()
        .then( user =>{
            if(user[0].usertype === 0 || user[0].usertype === 1)
            {
                Tickets.find({user: guestId})
                .select('_id ticketnumber user reason title description status date')
                .populate('user', '_id username phone email')
                .exec()
                .then(usertickets => {
                    const response = {
                        count: usertickets.length,
                        usertickets: usertickets.map(userticket => {
                            return {
                                _id : userticket._id,
                                ticketno : userticket.ticketno,
                                user : userticket.user,
                                reason : userticket.reason,
                                title : userticket.title,
                                description : userticket.description,
                                status : userticket.status,
                                date : userticket.date,
                                request: {
                                    type: 'GET',
                                    description: "get all ticket messages",
                                    url: 'https://villa-app.herokuapp.com/v1/support/tickets/messages/getall/' + userticket._id
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




//get all tickets for admin
router.get('/admin/getall' , checkAuth , (req, res, next) => {

    /*
    ******************** get all tickets for admin  Method ******************
    */
    const userId = req.userData.userId;
    const exp = req.userData.exp;
    if(exp > 1000) //if token is not expired
    {
        //check user availability
        User.find({_id: userId})
        .exec()
        .then( user =>{
            if(user[0].usertype === 2 )
            {
                Tickets.find()
                .select('_id ticketnumber user reason title description status date')
                .populate('user', '_id username phone email')
                .exec()
                .then(usertickets => {
                    const response = {
                        count: usertickets.length,
                        usertickets: usertickets.map(userticket => {
                            return {
                                _id : userticket._id,
                                ticketno : userticket.ticketno,
                                user : userticket.user,
                                reason : userticket.reason,
                                title : userticket.title,
                                description : userticket.description,
                                status : userticket.status,
                                date : userticket.date,
                                request: {
                                    type: 'GET',
                                    description: "get all ticket messages",
                                    url: 'https://villa-app.herokuapp.com/v1/support/tickets/messages/getall/' + userticket._id
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









//update tixket status
router.patch('/:ticketId' , checkAuth , (req, res, next) => {

    /*
    ******************** update ticket status  Method ******************
    */
    const userId = req.userData.userId;
    const exp = req.userData.exp;
    const ticketId = req.params.ticketId;

    if(exp > 1000) //if token is not expired
    {
        //check user availability
        User.find({_id: userId})
        .exec()
        .then( user =>{
            if(user[0].usertype === 2 ) //if user is admin
            {
                Tickets.updateOne({_id: ticketId} , {$set: {status : req.body.status}})
                        .exec()
                        .then(result => {

                            res.status(200).json({
                                message: "Ticket status updated successfully",
                                response : {
                                    type : "GET",
                                    url : "https://villa-app.herokuapp.com/v1/support/tickets/" + ticketId
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
                    message : "user is not Admin"
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
***************  Ticket messages
*************************************************************************
*/



//add new ticket messages
router.post('/messages',checkAuth, (req, res, next) => {

    /*
    ******************** add new ticket message Method ******************
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

                const ticketmessage = new TicketMessages({
                    _id: new mongoose.Types.ObjectId(),
                    ticket: req.body.ticket,
                    user: req.body.user,
                    usertype: usertype,
                    message: req.body.message,
                    time: req.body.time,
                    date: req.body.date
                });

                ticketmessage
                .save()
                .then(result => {
                    res.status(201).json({
                        message: "Ticket message added",
                        createdTicketMessage: result,
                        Request: {
                            type : "GET",
                            description: "GET single tickt message",
                            url: "https://villa-app.herokuapp.com/v1/support/tickets/messages/ticketmessageID"
                        }
                    });
                })
                .catch( err =>{
                    res.status(500).json({
                        error: err,
                        Request : {
                            type: "POST",
                            description: "add new ticket message",
                            url: "https://villa-app.herokuapp.com/v1/support/tickets/messages"
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





//GET single ticket message
router.get('/messages/:ticketmessageId',checkAuth, (req, res, next) => {

    const userId = req.userData.userId;
    const exp = req.userData.exp;
    chatmessageId = req.params.ticketmessageId;

    if(exp > 1000) // if token is valid
    {
        //Check user availability
        User.find({_id: userId})
        .exec()
        .then( user =>
        {


            if(user) //if user exist
            {
                TicketMessages.find({_id: chatmessageId})
                .select('_id usertype  message time date')
                .populate('user', '_id username phone email')
                .populate('ticket', '_id ticketnumber user reason title description status date')
                .exec()
                .then(chatmessage => {
                    if(chatmessage)
                    {
                        res.status(200).json({
                            ticketmessage: chatmessage,
                            Request : {
                                type: "GET",
                                description: "Get all ticket messages",
                                url: "https://villa-app.herokuapp.com/v1/support/tickets/messages/getall/"
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





 //get all ticket messages
router.get('/messages/getall/:ticketId' , checkAuth , (req, res, next) => {

    /*
    ******************** get all ticket messages  Method ******************
    */
    const userId = req.userData.userId;
    const exp = req.userData.exp;
    const chatId = req.params.ticketId;
    if(exp > 1000) //if token is not expired
    {
        //check user availability
        User.find({_id: userId})
        .exec()
        .then( user =>{

                TicketMessages.find({ticket: chatId})
                .select('_id usertype  message time date')
                .populate('user', '_id username phone email')
                .populate('ticket', '_id ticketnumber user reason title description status date')
                .exec()
                .then(chatmessages => {
                    const response = {
                        count: chatmessages.length,
                        ticketmessages: chatmessages.map(chatmessage => {
                            return {
                                _id : chatmessage._id,
                                usertype : chatmessage.usertype,
                                message : chatmessage.message,
                                time : chatmessage.time,
                                date : chatmessage.date,
                                user: chatmessage.user,
                                ticket: chatmessage.ticket,
                                request: {
                                    type: 'GET',
                                    description: "get single ticket message",
                                    url: 'https://villa-app.herokuapp.com/v1/support/tickets/messages/' + chatmessage._id
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

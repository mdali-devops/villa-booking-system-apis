/*
*************************************************
* Resource name : Reports (Route)
* Version : 1
* Author  : Baaztech
* URL     : https://villa-app.herokuapp.com/v1/reports
*************************************************
*                  Methods
* 1. add new villa report => /v1/reports/villa (POST)
* 2. get single villa report  => /v1/reports/villa/id (GET)
* 3. Get all villa reports for guest => /v1/reports/villa/guest/getall (GET)
* 4. Get all villa reports for admin => /v1/reports/villa/admin/getall (GET)
* 5. update villa report status, actionTaken => /v1/reports/villa/id (Patch)
* 6. update villa report by guest => /v1/reports/villa/guest (PATCH)
**************************************************************
*************  Host reports ***********************
* 1. add new Host report => /v1/reports/host (POST)
* 2. get single host report  => /v1/reports/host/id (GET)
* 3. Get all host reports for guest => /v1/reports/host/guest/getall (GET)
* 4. Get all host reports for admin => /v1/reports/host/admin/getall (GET)
* 5. update host report status, actionTaken => /v1/reports/host/id (Patch)
* 6. update host report by guest => /v1/reports/host/guest (PATCH)
*************************************************
*/


const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const checkAuth = require('../../../middleware/check-auth');

//import models
const User = require('../../models/user');
const VillaReports = require('../../models/reports/villaReport');
const HostReports = require('../../models/reports/hostReport');
//villa model
const Villa = require('../../models/villas/villa');


/*
****************************
     Villa Reports
 ***************************
 */

//add new villa report
router.post('/villa',checkAuth, (req, res, next) => {

    /*
    ******************** add new villa report Method ******************
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

                const villareport = new VillaReports({
                    _id: new mongoose.Types.ObjectId(),
                    user: req.userData.userId,
                    villa: req.body.villa,
                    actionTaken: req.body.actionTaken,
                    userReview: req.body.userReview,
                    reason: req.body.reason,
                    title: req.body.title,
                    description: req.body.description,
                    status: req.body.status, //0 for open, 1 for closed
                    date: req.body.date,

                });

                villareport
                .save()
                .then(result => {
                    res.status(201).json({
                        message: "villa report generated",
                        createdReport: result,
                        Request: {
                            type : "GET",
                            description: "GET single report",
                            url: "https://villa-app.herokuapp.com//v1/reports/villa/villaID"
                        }
                    });
                })
                .catch( err =>{
                    res.status(500).json({
                        error: err,
                        Request : {
                            type: "POST",
                            description: "add new villa report",
                            url: "https://villa-app.herokuapp.com/v1/reports/villa"
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




//GET single villa report
router.get('/villa/:reportId',checkAuth, (req, res, next) => {

    const userId = req.userData.userId;
    const exp = req.userData.exp;
    reportId = req.params.reportId;

    if(exp > 1000) // if token is valid
    {
        //Check user availability
        User.find({_id: userId})
        .exec()
        .then( user =>
        {


            if(user) //if user exist
            {
                VillaReports.find({_id: reportId})
                .select('_id villa reason title description actionTaken userReview status date')
                .populate('user', '_id username phone email')
                .exec()
                .then(report => {
                    if(report)
                    {
                        res.status(200).json({
                            VillaReport: report,
                            Request : {
                                type: "POST",
                                description: "add new villa report ",
                                url: "https://villa-app.herokuapp.com/v1/reports/villa/" + report._id
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



//get all villa reports for guest
router.get('/villa/guest/getall' , checkAuth , (req, res, next) => {

    /*
    ******************** get all villa reports for guest  Method ******************
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
                VillaReports.find({user: userId})
                .select('_id reason title description actionTaken userReview status date')
                .populate('user', '_id username phone email')
                .exec()
                .then(villareports => {
                    const response = {
                        count: villareports.length,
                        villaReports: villareports.map(villareport => {
                            return {
                                _id : villareport._id,
                                user: villareport.userId,
                                villa: villareport.villa,
                                actionTaken: villareport.actionTaken,
                                userReview: villareport.userReview,
                                reason: villareport.reason,
                                title: villareport.title,
                                description: villareport.description,
                                status: villareport.status, //0 for open, 1 for closed
                                date: villareport.date
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


//get all villa reports for admin
router.get('/villa/admin/getall' , checkAuth , (req, res, next) => {

    /*
    ******************** get all villa reports for admin  Method ******************
    */
    const userId = req.userData.userId;
    const exp = req.userData.exp;

    if(exp > 1000) //if token is not expired
    {
        //check user availability
        User.find({_id: userId})
        .exec()
        .then( user =>{
            if(user[0].usertype === 2) //if user is admin
            {
                VillaReports.find()
                .select('_id reason title description actionTaken userReview status date')
                .populate('user', '_id username phone email')
                .exec()
                .then(villareports => {
                    const response = {
                        count: villareports.length,
                        villaReports: villareports.map(villareport => {
                            return {
                                _id : villareport._id,
                                user: villareport.userId,
                                villa: villareport.villa,
                                actionTaken: villareport.actionTaken,
                                userReview: villareport.userReview,
                                reason: villareport.reason,
                                title: villareport.title,
                                description: villareport.description,
                                status: villareport.status, //0 for open, 1 for closed
                                date: villareport.date
                            }
                        })
                    };
                    res.status(200).json(response);
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





//update villa report status
router.patch('/villa/:reportId',checkAuth, (req, res, next) => {

    /*
    ******************** update villa report status Method ******************
    */

    const reportId = req.params.reportId;
    const userId = req.userData.userId;
    const exp = req.userData.exp;
    const updateOps = {};
    if(exp > 1000) //if token is not expired
    {
        for (const ops of req.body)
        {
                updateOps[ops.propName] = ops.value;
        }
        //check user availability
        User.find({_id: userId})
        .exec()
        .then( admin =>{
            if(admin[0].usertype === 2) //if it is admin
            {
                VillaReports.updateOne({_id: reportId} , {$set: updateOps})
                .exec()
                .then(result => {

                    res.status(200).json({
                        message: " villa report status updated successfully",
                        response : {
                            type : "GET",
                            url : "https://villa-app.herokuapp.com/v1/reports/villa/" + reportId
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
            else //if it is not admin
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



//update villa report by guest
router.patch('/villa/guest/:reportId',checkAuth, (req, res, next) => {

    /*
    ******************** update villa report by guest Method ******************
    */

    const reportId = req.params.reportId;
    const userId = req.userData.userId;
    const exp = req.userData.exp;
    if(exp > 1000) //if token is not expired
    {

        //check user availability
        User.find({_id: userId})
        .exec()
        .then( admin =>{
            if(admin[0].usertype === 0) //if it is host
            {
                VillaReports.updateOne({_id: reportId} , {$set: {userReview: req.body.userReview}})
                .exec()
                .then(result => {

                    res.status(200).json({
                        message: " villa report userReview updated successfully",
                        response : {
                            type : "GET",
                            url : "https://villa-app.herokuapp.com/v1/reports/villa/" + reportId
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
            else //if it is not admin
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




/*
****************************
     Host Reports
 ***************************
 */





//add new host report
router.post('/host',checkAuth, (req, res, next) => {

    /*
    ******************** add new host report Method ******************
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

                const hostreport = new HostReports({
                    _id: new mongoose.Types.ObjectId(),
                    user: req.userData.userId,
                    host: req.body.host,
                    actionTaken: req.body.actionTaken,
                    userReview: req.body.userReview,
                    reason: req.body.reason,
                    title: req.body.title,
                    description: req.body.description,
                    status: req.body.status, //0 for open, 1 for closed
                    date: req.body.date,

                });

                hostreport
                .save()
                .then(result => {
                    res.status(201).json({
                        message: "host report generated",
                        createdReport: result,
                        Request: {
                            type : "GET",
                            description: "GET single report",
                            url: "https://villa-app.herokuapp.com//v1/reports/host/hostID"
                        }
                    });
                })
                .catch( err =>{
                    res.status(500).json({
                        error: err,
                        Request : {
                            type: "POST",
                            description: "add new host report",
                            url: "https://villa-app.herokuapp.com/v1/reports/host"
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




//GET single host report
router.get('/host/:reportId',checkAuth, (req, res, next) => {

    const userId = req.userData.userId;
    const exp = req.userData.exp;
    reportId = req.params.reportId;

    if(exp > 1000) // if token is valid
    {
        //Check user availability
        User.find({_id: userId})
        .exec()
        .then( user =>
        {


            if(user) //if user exist
            {
                HostReports.find({_id: reportId})
                .select('_id reason title description actionTaken userReview status date')
                .populate('user', '_id username phone email')
                .populate('host', '_id username phone email')
                .exec()
                .then(report => {
                    if(report)
                    {
                        res.status(200).json({
                            HostReport: report,
                            Request : {
                                type: "POST",
                                description: "add new host report ",
                                url: "https://villa-app.herokuapp.com/v1/reports/host/" + report._id
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



//get all host reports for guest
router.get('/host/guest/getall' , checkAuth , (req, res, next) => {

    /*
    ******************** get all host reports for guest  Method ******************
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
                HostReports.find({user: userId})
                .select('_id reason title description actionTaken userReview status date')
                .populate('user', '_id username phone email')
                .populate('host', '_id username phone email')
                .exec()
                .then(hostreports => {
                    const response = {
                        count: hostreports.length,
                        hostReports: hostreports.map(hostreport => {
                            return {
                                _id : hostreport._id,
                                user: hostreport.userId,
                                host: hostreport.host,
                                actionTaken: hostreport.actionTaken,
                                userReview: hostreport.userReview,
                                reason: hostreport.reason,
                                title: hostreport.title,
                                description: hostreport.description,
                                status: hostreport.status, //0 for open, 1 for closed
                                date: hostreport.date
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


//get all host reports for admin
router.get('/host/admin/getall' , checkAuth , (req, res, next) => {

    /*
    ******************** get all host reports for admin  Method ******************
    */
    const userId = req.userData.userId;
    const exp = req.userData.exp;

    if(exp > 1000) //if token is not expired
    {
        //check user availability
        User.find({_id: userId})
        .exec()
        .then( user =>{
            if(user[0].usertype === 2) //if user is admin
            {
                VillaReports.find()
                .select('_id reason title description actionTaken userReview status date')
                .populate('user', '_id username phone email')
                .exec()
                .then(hostreports => {
                    const response = {
                        count: hostreports.length,
                        hostReports: hostreports.map(hostreport => {
                            return {
                                _id : hostreport._id,
                                user: hostreport.userId,
                                host: hostreport.host,
                                actionTaken: hostreport.actionTaken,
                                userReview: hostreport.userReview,
                                reason: hostreport.reason,
                                title: hostreport.title,
                                description: hostreport.description,
                                status: hostreport.status, //0 for open, 1 for closed
                                date: hostreport.date
                            }
                        })
                    };
                    res.status(200).json(response);
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




//update host report status
router.patch('/host/:reportId',checkAuth, (req, res, next) => {

    /*
    ******************** update host report status Method ******************
    */

    const reportId = req.params.reportId;
    const userId = req.userData.userId;
    const exp = req.userData.exp;
    const updateOps = {};
    if(exp > 1000) //if token is not expired
    {
        for (const ops of req.body)
        {
                updateOps[ops.propName] = ops.value;
        }
        //check user availability
        User.find({_id: userId})
        .exec()
        .then( admin =>{
            if(admin[0].usertype === 2) //if it is admin
            {
                HostReports.updateOne({_id: reportId} , {$set: updateOps})
                .exec()
                .then(result => {

                    res.status(200).json({
                        message: " host report status updated successfully",
                        response : {
                            type : "GET",
                            url : "https://villa-app.herokuapp.com/v1/reports/host/" + reportId
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
            else //if it is not admin
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





//update host report by guest
router.patch('/host/guest/:reportId',checkAuth, (req, res, next) => {

    /*
    ******************** update host report by guest Method ******************
    */

    const reportId = req.params.reportId;
    const userId = req.userData.userId;
    const exp = req.userData.exp;
    if(exp > 1000) //if token is not expired
    {

        //check user availability
        User.find({_id: userId})
        .exec()
        .then( admin =>{
            if(admin[0].usertype === 0) //if it is guest
            {
                HostReports.updateOne({_id: reportId} , {$set: {userReview: req.body.userReview}})
                .exec()
                .then(result => {

                    res.status(200).json({
                        message: " host report userReview updated successfully",
                        response : {
                            type : "GET",
                            url : "https://villa-app.herokuapp.com/v1/reports/host/" + reportId
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
            else //if it is not admin
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
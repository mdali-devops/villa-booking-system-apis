/*
*************************************************
* Resource name : Villa Services (Route)
* Version : 1
* Author  : Baaztech
* URL     : https://villa-app.herokuapp.com/v1/villas
*************************************************
*                  Methods
* 1. add admin villa  service => /v1/villas/adminvillaservices (POST)
* 2. get admin villa service  =>  /v1/villas/adminvillaservices/id (GET)
* 3. delete admin villa service =>  /v1/villas/adminvillaservices/id (DELETE)
* 4. update admin villa service =>  /v1/villas/adminvillaservices/id (PATCH)
* 5. get all admin villa services  =>  /v1/villas/adminvillaservices (GET)
*************************************************
*/
const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const checkAuth = require('../../../middleware/check-auth');

//import models
const User = require('../../models/user');

//admin villa services model
const AdminVillaService = require('../../models/villas/services/adminServices');

//host villa services model
const HostVillaService = require('../../models/villas/services/hostServices');



/*
 ***************************************
 ********** villa services (admin) ****
 **************************************
*/

router.post('/admin',checkAuth, (req, res, next) => {

    /*
    ******************** add Admin villa services Method ******************
    */
    const exp = req.userData.exp;
    if(req.body.admin === req.userData.userId && exp > 1000) // if user id and token  match
    {
        //Check phone availability
        User.find({_id: req.body.admin})
        .exec()
        .then( admin =>
        {
            const usertype = admin[0].usertype;
            if(usertype == 2) //if user is admin
            {
                const adminvillaservice = new AdminVillaService({
                    _id: new mongoose.Types.ObjectId(),
                    name: req.body.name,
                    type: req.body.type,
                    pool_size : req.body.pool_size,
                    date: req.body.date
                });

                adminvillaservice
                .save()
                .then(result => {
                    res.status(201).json({
                        message: "Admin Villa Service Added",
                        createdservice: result,
                        Request: {
                            type : "GET",
                            description: "GET admin villa service",
                            url: "https://villa-app.herokuapp.com/v1/villas/services/admin"
                        }
                    });
                })
                .catch( err =>{
                    res.status(500).json({
                        error: err,
                        Request : {
                            type: "POST",
                            description: "add new admin villa service",
                            url: "https://villa-app.herokuapp.com/v1/villas/services/admin",
                            data: {

                                admin: "admin id",
                                name: "service name",
                                type: "service type name",
                                pool_size: "add pool size if service is pool size other leave blank",
                                date: "21-09-2021"
                            }
                        }
                    });
                });
            }
            else
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
                Message : "Admin not found"
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

//get admin villa service
router.get('/admin/:sericeId',checkAuth, (req, res, next) => {

    /*
    ******************** get admin villa  service Method ******************
    */
    const serviceId = req.params.sericeId;
    const userId = req.userData.userId;
    const exp = req.userData.exp;
    if(exp > 1000) //if token is not expired
    {
        //check user availability
        User.find({_id: userId})
        .exec()
        .then( admin =>{
            if(admin[0].usertype === 2) //if it is admin
            {
                AdminVillaService.find({_id: serviceId})
                .select('_id name type date')
                .exec()
                .then(service => {
                    if(service)
                    {
                        res.status(200).json({
                            adminvillaservice: service,
                            Request : {
                                type: "PATCH",
                                description: "update admin villa service",
                                url: "https://villa-app.herokuapp.com/v1/villas/services/admin/" + serviceId,
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

 //update admin villa service
 router.patch('/admin/:villaId',checkAuth, (req, res, next) => {

    /*
    ******************** update admin villa service Method ******************
    */

    const serviceId = req.params.villaId;
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
                AdminVillaService.updateOne({_id: serviceId} , {$set: updateOps})
                .exec()
                .then(result => {

                    res.status(200).json({
                        message: "Admin villa Service updated successfully",
                        response : {
                            type : "GET",
                            url : "https://villa-app.herokuapp.com/v1/villas/services/admin/" + serviceId
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


 //delete admin villa service
 router.delete('/admin/:villaId',checkAuth, (req, res, next) => {

    /*
    ******************** delete admin villa service Method ******************
    */
    const serviceId = req.params.villaId;
    const userId = req.userData.userId;
    const exp = req.userData.exp;
    if(exp > 1000) //if token is not expired
    {
        //check user availability
        User.find({_id: userId})
        .exec()
        .then( admin =>{
            if(admin[0].usertype === 2) //if it is admin
            {
                AdminVillaService.deleteOne({_id: serviceId})
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: "Admin villa service deleted",
                        response: {
                            type: 'POST',
                            url: 'https://villa-app.herokuapp.com/v1/villas/services/admin'
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



//get all admin villa services
router.get('/admin',checkAuth, (req, res, next) => {

    /*
    ******************** get admin villa  service Method ******************
    */
    const userId = req.userData.userId;
    const exp = req.userData.exp;
    if(exp > 1000) //if token is not expired
    {
        //check user availability
        User.find({_id: userId})
        .exec()
        .then( user =>{

            AdminVillaService.find()
            .select('_id name type pool_size date')
            .exec()
            .then(adminservices => {
                const response = {
                    count: adminservices.length,
                    services: adminservices.map(service => {
                        return {
                            _id : service._id,
                            name : service.name,
                            type : service.type,
                            pool_size : service.pool_size,
                            date : service.date,
                            request: {
                                type: 'GET',
                                url: 'https://villa-app.herokuapp.com/v1/villas/services/admin/' +service._id
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










/*
 ***************************************
 ********** villa services (Host) ****
 **************************************
*/

router.post('/host',checkAuth, (req, res, next) => {

    /*
    ******************** add host villa services Method ******************
    */
    const exp = req.userData.exp;
    if(req.body.host === req.userData.userId && exp > 1000) // if user id and token  match
    {
        //Check phone availability
        User.find({_id: req.body.host})
        .exec()
        .then( host =>
        {
            const usertype = host[0].usertype;
            if(usertype == 1) //if user is host
            {
                const hostvillaservice = new HostVillaService({
                    _id: new mongoose.Types.ObjectId(),
                    service_id: req.body.service_id,
                    villa: req.body.villa,
                    price: req.body.price,
                    pool_size : req.body.pool_size,
                    date: req.body.date
                });

                hostvillaservice
                .save()
                .then(result => {
                    res.status(201).json({
                        message: "Host Villa Service Added",
                        createdservice: result,
                        Request: {
                            type : "GET",
                            description: "GET host villa service",
                            url: "https://villa-app.herokuapp.com/v1/villas/services/host"
                        }
                    });
                })
                .catch( err =>{
                    res.status(500).json({
                        error: err,
                        Request : {
                            type: "POST",
                            description: "add new host villa service",
                            url: "https://villa-app.herokuapp.com/v1/villas/services/host",
                            data: {

                                service_id: "admin service id",
                                villa: "villa id",
                                price: 234,
                                pool_size: "add pool size if service is pool size other leave blank",
                                date: "21-09-2021"
                            }
                        }
                    });
                });
            }
            else
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
                Message : "Admin not found"
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

//get host villa service
router.get('/host/:sericeId',checkAuth, (req, res, next) => {

    /*
    ******************** get host villa  service Method ******************
    */
    const serviceId = req.params.sericeId;
    const userId = req.userData.userId;
    const exp = req.userData.exp;
    if(exp > 1000) //if token is not expired
    {
        //check user availability
        User.find({_id: userId})
        .exec()
        .then( host =>{
            if(host[0].usertype === 1) //if it is host
            {
                HostVillaService.find({_id: serviceId})
                .select('_id price pool_size date')
                .populate('service_id', '_id name type pool_size')
                .exec()
                .then(service => {
                    if(service)
                    {
                        res.status(200).json({
                            hostvillaservice: service,
                            Request : {
                                type: "PATCH",
                                description: "update host villa service",
                                url: "https://villa-app.herokuapp.com/v1/villas/services/host/" + serviceId,
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

 //update host villa service
 router.patch('/host/:villaId',checkAuth, (req, res, next) => {

    /*
    ******************** update host villa service Method ******************
    */

    const serviceId = req.params.villaId;
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
        .then( host =>{
            if(host[0].usertype === 1) //if it is host
            {
                HostVillaService.updateOne({_id: serviceId} , {$set: updateOps})
                .exec()
                .then(result => {

                    res.status(200).json({
                        message: "Host villa Service updated successfully",
                        response : {
                            type : "GET",
                            url : "https://villa-app.herokuapp.com/v1/villas/services/host/" + serviceId
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


 //delete host villa service
 router.delete('/host/:villaId',checkAuth, (req, res, next) => {

    /*
    ******************** delete host villa service Method ******************
    */
    const serviceId = req.params.villaId;
    const userId = req.userData.userId;
    const exp = req.userData.exp;
    if(exp > 1000) //if token is not expired
    {
        //check user availability
        User.find({_id: userId})
        .exec()
        .then( host =>{
            if(host[0].usertype === 1) //if it is admin
            {
                HostVillaService.deleteOne({_id: serviceId})
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: "Host villa service deleted",
                        response: {
                            type: 'POST',
                            url: 'https://villa-app.herokuapp.com/v1/villas/services/host'
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



//get all host villa services
router.get('/host',checkAuth, (req, res, next) => {

    /*
    ******************** get admin villa  service Method ******************
    */
    const userId = req.userData.userId;
    const exp = req.userData.exp;
    const villaId = req.body.villaId;

    if(exp > 1000) //if token is not expired
    {
        //check user availability
        User.find({_id: userId})
        .exec()
        .then( user =>{

            HostVillaService.find({villa: villaId})
            .select('_id villa price pool_size date')
            .populate('service_id', '_id name type pool_size')
            .exec()
            .then(hostservices => {
                const response = {
                    count: hostservices.length,
                    services: hostservices.map(service => {
                        return {
                            _id : service._id,
                            service_id : service.service_id,
                            villa: service.villa,
                            price: service.price,
                            pool_size : service.pool_size,
                            date : service.date,
                            request: {
                                type: 'GET',
                                url: 'https://villa-app.herokuapp.com/v1/villas/services/host/' +service._id
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

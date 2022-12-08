/*
*************************************************
* Resource name : Users (Route)
* Version : 1
* Author  : Baaztech
* URL     : https://villa-app.herokuapp.com/v1/users
*************************************************
*                  Methods
* 1. add new user => https://villa-app.herokuapp.com/v1/users (POST)
* 2. Login User =>  https://villa-app.herokuapp.com/v1/users/login (POST)
* 3. update user => https://villa-app.herokuapp.com/v1/users (PATCH)
* 4. delete user => https://villa-app.herokuapp.com/v1/users (DELETE)
* 5. Get User detailes => https://villa-app.herokuapp.com/v1/users (GET)
*************************************************
*/


const express = require('express');
const router = express.Router();
const path = require("path");
const fs = require('fs');

const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/users/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '_') + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const checkAuth = require('../../middleware/check-auth');

//import models
const User = require('../models/user');
//guest specific models
const GuestProfile = require('../models/profile/guestProfile');
const GuestPreference = require('../models/preferences/guestPreference');
// host specific models
const HostProfile = require('../models/profile/hostProfile');
const HostPreference = require('../models/preferences/hostPreference');
// admin specific models
const AdminProfile = require('../models/profile/adminProfile');
const AdminPreference = require('../models/preferences/adminPreference');
const user = require('../models/user');

/*
****************************
     Authenticate
 ***************************
 */


 router.patch('/userprofile/img', checkAuth, upload.single('productImage'), (req, res, next) => {
    const userId = req.userData.userId;
    const exp = req.userData.exp;

    if(exp > 1000)
    {
        User.findOne({_id: userId})
        .select('login_status usertype')
        .exec()
        .then(userloginstatus => {
            if(userloginstatus.login_status === true)
            {
                if(userloginstatus.usertype === 0)
                {

                    GuestProfile.findOne({user: userId})
                    .select('picture')
                    .exec()
                    .then(profil => {

                        try {
                            fs.unlinkSync(profil.picture)
                            //file removed
                          } catch(err) {
                            console.error(err)
                          }
                        GuestProfile.updateOne({user: userId} , {$set: {picture: req.file.path}})
                        .exec()
                        .then(result => {

                            res.status(200).json({
                                message: "User profile image added successfully"
                            });
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({
                                error: err,
                                message: "failed at updating"
                            });
                        });
                    })
                    .catch(err => {
                        res.status(500).json({
                            error: err
                        });
                    });
                }
                else if(userloginstatus.usertype === 1)
                {
                    try {
                        fs.unlinkSync(profil.picture)
                        //file removed
                      } catch(err) {
                        console.error(err)
                      }
                    HostProfile.updateOne({user: userId} , {$set: {picture: req.file.path}})
                    .exec()
                    .then(result => {
                        res.status(200).json({
                            message: "Host profile image added successfully"
                        });
                    })
                    .catch(err => {
                        res.status(500).json({
                            error: err,
                            message: "failed at updating"
                        });
                    });
                }
                else if(userloginstatus.usertype === 2)
                {
                    try {
                        fs.unlinkSync(profil.picture)
                        //file removed
                      } catch(err) {
                        console.error(err)
                      }
                    AdminProfile.updateOne({user: userId} , {$set: {picture: req.file.path}})
                    .exec()
                    .then(result => {

                        res.status(200).json({
                            message: "User profile image added successfully"
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err,
                            message: "failed at updating"
                        });
                    });
                }
                else
                {

                }
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err,
                message:"failed finding guest profile"
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



router.post('/userprofile/img', checkAuth, upload.single('productImage'), (req, res, next) => {
    const userId = req.userData.userId;
    const exp = req.userData.exp;

    if(exp > 1000)
    {
        User.findOne({_id: userId})
        .select('login_status usertype')
        .exec()
        .then(userloginstatus => {
            if(userloginstatus.login_status === true)
            {
                if(userloginstatus.usertype === 0)
                {
                    GuestProfile.updateOne({user: userId} , {$set: {picture: req.file.path}})
                    .exec()
                    .then(result => {

                        res.status(200).json({
                            message: "User profile image added successfully"
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err,
                            message: "failed at updating"
                        });
                    });
                }
                else if(userloginstatus.usertype === 1)
                {
                    HostProfile.updateOne({user: userId} , {$set: {picture: req.file.path}})
                    .exec()
                    .then(result => {
                        res.status(200).json({
                            message: "Host profile image added successfully"
                        });
                    })
                    .catch(err => {
                        res.status(500).json({
                            error: err,
                            message: "failed at updating"
                        });
                    });
                }
                else if(userloginstatus.usertype === 2)
                {
                    AdminProfile.updateOne({user: userId} , {$set: {picture: req.file.path}})
                    .exec()
                    .then(result => {

                        res.status(200).json({
                            message: "User profile image added successfully"
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err,
                            message: "failed at updating"
                        });
                    });
                }
                else
                {

                }
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err,
                message:"failed finding guest profile"
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


 router.post('/', (req, res, next) => {
    
    const account_type = req.body.login_method;


    if(account_type === 0) //signup using phone
    {
        //check if actually admin is signing up
        if(req.body.usertype === 0 || req.body.usertype === 1)
        {
            //Check phone availability
            User.find({phone: req.body.phone})
            .exec()
            .then( user => {
                if(user.length >= 1)
                {
                    return res.status(409).json({
                        message: "phone already exists"
                    });
                }
                else
                {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        username: req.body.username,
                        usertype: req.body.usertype, //0 for guest, 1 for host, and 2 for admin
                        phone: req.body.phone,
                        email: req.body.email,
                        password: req.body.phone,
                        login_method: req.body.login_method,
                        login_status: false,
                        verified: req.body.verified,
                        date: req.body.date
                    });

                    user
                    .save()
                    .then(result => {
                        res.status(201).json({
                            message: " User Added",
                            createdUser: result,
                            Request: {
                                type : "POST",
                                description: "Login  User",
                                url: "https://villa-app.herokuapp.com/v1/users/login",
                                data : {
                                    phone: "phone",
                                    email: "email",
                                    login_method: 0
                                }
                            }
                        });
                    })
                    .catch( err => {
                        console.log(err);
                        res.status(500).json({
                            error: err,
                            Request : {
                                type: "POST",
                                description: "add new user",
                                url: "https://villa-app.herokuapp.com/v1/users",
                                data: {
                                    username: "username",
                                    usertype: "0 for guest, 1 for host, and 2 for admin",
                                    phone: "if login method is 0 then input phone otherwise just sent pharse 'phone'",
                                    email: "if login method is 1 then input email otherwise just sent pharse 'email'",
                                    password: "if login method is 0 then send phone and if login method is 1 then send email",
                                    login_method: "0 for phone, 1 for google, 2 for facebook , 3 for email",
                                    verified: "Bool",
                                    date: "19-09-2021"
                                }
                            }
                        });
                    });
                }
            });
        }
        else if(req.body.usertype === 2)
        {
            return res.status(400).json({
                message: "invalid usertype or login method"
            });
        }
        else
        {
            return res.status(404).json({
                message: "requested login method not supported"
            });
        }
    }
    else if(account_type ===1) //signup using google
    {

    }
    else if(account_type ===2) //signup using facebook
    {

    }
    else if(account_type ===3) //signup using email
    {
        //Check email availability
            User.find({email: req.body.email})
            .exec()
            .then( user => {
                if(user.length >= 1)
                {
                    return res.status(409).json({
                        message: "user already exists"
                    });
                }
                else
                {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        username: req.body.username,
                        usertype: req.body.usertype, //0 for guest, 1 for host, and 2 for admin
                        phone: req.body.phone,
                        email: req.body.email,
                        password: req.body.password,
                        login_method: req.body.login_method,
                        login_status: false,
                        verified: req.body.verified,
                        date: req.body.date
                    });

                    user
                    .save()
                    .then(result => {
                        res.status(201).json({
                            message: "Admin User Added",
                            createdUser: result,
                            Request: {
                                method : "POST",
                                description: "Login User",
                                url: "https://villa-app.herokuapp.com/v1/users/login",
                                data : {
                                    email: "email",
                                    password: "passeord",
                                    login_method: 3
                                }
                            }
                        });
                    })
                    .catch( err => {
                        console.log(err);
                        res.status(500).json({
                            error: err,
                            Request : {
                                method: "POST",
                                description: "add new admin",
                                url: "https://villa-app.herokuapp.com/v1/users",
                                data: {
                                    username: "username",
                                    usertype: "0 for guest, 1 for host, and 2 for admin",
                                    phone: "email",
                                    email: "email",
                                    password: "password",
                                    login_method: 3,
                                    verified: "Bool",
                                    date: "19-09-2021"
                                }
                            }
                        });
                    });
                }
            });
    }
    else //invalid signup method
    {
        return res.status(404).json({
            message: "requested signup method is not supported"
        });
    }


});



/**
 * @swagger
 * /v1/users/login:
 *   Post:
 *     summary: Login User
 *     description: Use this endpoint to Login user. .
*/
router.post('/login', (req, res, next) => {

    const login_method = req.body.login_method;

    //check login type
    if(login_method === 0) //login with phone number
    {
        User.find({phone: req.body.phone})
        .exec()
        .then(user => {
            if(user.length > 0)
            {
                const updateOps ={};
                for (var i=1;i==1;i++)
                {
                    updateOps['login_status'] = true;
                }
                var useridnow= user[0]._id;
                User.updateOne({_id: useridnow} , {$set: updateOps})
                .exec()
                .then(result => {
                    console.log(result);
                })
                .catch(err => {
                    console.log(err);
                });

                const token = jwt.sign({
                    phone: user[0].phone,
                    userId: user[0]._id
                },
                // process.env.JWT_KEY
                process.env.JWT_KEY,
                {
                    expiresIn: "30d"
                }
                );
                return res.status(200).json({
                    user_id: user[0]._id,
                    login_status: true,
                    message: "Auth Successful",
                    token: token
                });
            }
            else
            {
                res.status(500).json({
                    error: err,
                    message: "Auth Failed"
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
    else if(login_method === 1) //login with google
    {

    }
    else if(login_method === 2) //login with facebook
    {

    }
    else if(login_method === 3) //login with email
    {
        User.find({email: req.body.email})
        .exec()
        .then(user => {
            if(user.length > 0)
            {
                if(req.body.password === user[0].password)
                {
                    const updateOps ={};
                    for (var i=1;i==1;i++)
                    {
                        updateOps['login_status'] = true;
                    }
                    var useridnow= user[0]._id;
                    User.updateOne({_id: useridnow} , {$set: updateOps})
                    .exec()
                    .then(result => {
                        console.log(result);
                    })
                    .catch(err => {
                        console.log(err);
                    });
                    const token = jwt.sign({
                        phone: user[0].email,
                        userId: user[0]._id
                    },
                    // process.env.JWT_KEY
                    process.env.JWT_KEY,
                    {
                        expiresIn: "30d"
                    }
                    );
                    return res.status(200).json({
                        user_id: user[0]._id,
                        login_status: true,
                        message: "Auth Successful",
                        token: token
                    });
                }
                else
                {
                    res.status(500).json({
                        error: err,
                        message: "Auth Failed, invalid login details"
                    });
                }
            }
            else
            {
                res.status(500).json({
                    error: err,
                    message: "Auth Failed"
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
    else //invalid login method
    {

    }

});

// Logout User
router.patch('/logout/logoutnow', checkAuth , (req, res, next) => {
    const userId = req.userData.userId;
    const exp = req.userData.exp;
    if(exp > 100) //check if correct user is modefing the data
    {
        const updateOps ={};
        for (var i=1;i==1;i++)
        {
            updateOps['login_status'] = false;
        }
        User.updateOne({_id: userId} , {$set: updateOps})
        .exec()
        .then(result => {
            res.status(200).json({
                message: "User Logged out successfully",
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
    }
    else
    {
        res.status(401).json({
            message : "you are not allowed to access this data"
        });
    }
});
//update user
router.patch('/:userId', checkAuth , (req, res, next) => {
    const id = req.params.userId;

    const userId = req.userData.userId;
    const exp = req.userData.exp;

    if(userId === id && exp > 100) //check if correct user is modefing the data
    {
        const updateOps ={};
        for (const ops of req.body)
        {
            updateOps[ops.propName] = ops.value;
        }
        User.updateOne({_id: id} , {$set: updateOps})
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: "User updated successfully",
                response : {
                    type : "GET",
                    url : "https://villa-app.herokuapp.com/v1/users/" + id
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
            res.status(401).json({
                message : "you are not allowed to access this data"
            });
    }
});


//get user data
router.get('/:userId', checkAuth , (req, res, next) => {
    const id = req.params.userId;

    const userId = req.userData.userId;
    const exp = req.userData.exp;

    if(userId === id && exp > 100) //check if correct user is modefing the data
    {
        User.find({_id:id})
        .select('username usertype phone email login_method login_status verified date')
        .exec()
        .then(doc => {
            if(doc)
            {
                res.status(200).json({
                    user: doc
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
    else
    {
            res.status(401).json({
                message : "you are not allowed to access this data"
            });
    }

});



router.delete('/', checkAuth ,  (req, res, next) => {
    const userId = req.userData.userId;
    const exp = req.userData.exp;

    if(userId === id && exp > 100) //check if correct user is modefing the data
    {
        res.status(200).json({
            message: "Handling Delete request to /v1/users/userId"
        });
    }
    else
    {
            res.status(401).json({
                message : "you are not allowed to access this data"
            });
    }
});



/*
****************************
     Profile
 ***************************
 */

router.post('/profile', checkAuth, (req, res, next) => {

    /*
    ******************** Signup Method ******************
    * 0 for guest,
    * 1 for host,
    * 2 for admin
    */

        const user_type = req.body.usertype;

        if(user_type === 0) //guest profile
        {
            //Check phone availability
            User.find({_id: req.body._id})
            .exec()
            .then( user => {
                if(user.length >= 1)
                {
                    const userId = req.userData.userId;
                    const exp = req.userData.exp;
                    console.log(userId);
                    console.log("exp");
                    console.log(exp);
                    if(userId === req.body._id && exp > 100) //check if correct user is modefing the data
                    {
                        const profile = new GuestProfile({
                            _id: new mongoose.Types.ObjectId(),
                            user: req.body._id,
                            username: req.body.username,
                            phone: req.body.phone,
                            email: req.body.email,
                            about: req.body.about,
                            picture: req.body.picture,
                            date: req.body.date
                        });

                        profile
                        .save()
                        .then(result => {
                            res.status(201).json({
                                message: "Guest Profile Added",
                                createdProfile: result,
                                Request: {
                                    type : "GET",
                                    description: "GET Guest profile",
                                    url: "https://villa-app.herokuapp.com/v1/users/profile"
                                }
                            });
                        })
                        .catch( err => {
                            console.log(err);
                            res.status(500).json({
                                error: err,
                                Request : {
                                    type: "POST",
                                    description: "add new guest profile",
                                    url: "https://villa-app.herokuapp.com/v1/users/profile",
                                    data: {
                                        user: "_id",
                                        usertype: 0,
                                        username: "username",
                                        phone: "if login method is 0 then input phone otherwise just sent pharse 'phone'",
                                        email: "if login method is 1 then input email otherwise just sent pharse 'email'",
                                        about: "about",
                                        picture: "picture",
                                        date: "19-09-2021"
                                    }
                                }
                            });
                        });
                    }
                    else
                    {
                            res.status(401).json({
                                message : "you are not allowed to access this data"
                            });
                    }
                }
                else
                {
                    return res.status(404).json({
                        message: "invalid user id"
                    });
                }
            });
        }
        else if(user_type === 1) //host profile
        {
            //Check phone availability
            User.find({_id: req.body._id})
            .exec()
            .then( user => {
                if(user.length >= 1)
                {
                    const userId = req.userData.userId;
                    const exp = req.userData.exp;

                    if(userId === req.body._id && exp > 100) //check if correct user is modefing the data
                    {
                        const profile = new HostProfile({
                            _id: new mongoose.Types.ObjectId(),
                            user: req.body._id,
                            username: req.body.username,
                            phone: req.body.phone,
                            email: req.body.email,
                            identity_verification: req.body.identity_verification,
                            picture: req.body.picture,
                            date: req.body.date
                        });

                        profile
                        .save()
                        .then(result => {
                            res.status(201).json({
                                message: "Host Profile Added",
                                createdProfile: result,
                                Request: {
                                    type : "GET",
                                    description: "GET Host profile",
                                    url: "https://villa-app.herokuapp.com/v1/users/profile"
                                }
                            });
                        })
                        .catch( err => {
                            console.log(err);
                            res.status(500).json({
                                error: err,
                                Request : {
                                    type: "POST",
                                    description: "add new host profile",
                                    url: "https://villa-app.herokuapp.com/v1/users/profile",
                                    data: {
                                        user: "_id",
                                        usertype: 0,
                                        username: "username",
                                        phone: "if login method is 0 then input phone otherwise just sent pharse 'phone'",
                                        email: "if login method is 1 then input email otherwise just sent pharse 'email'",
                                        identity_verification: false,
                                        picture: "picture",
                                        date: "19-09-2021"
                                    }
                                }
                            });
                        });
                    }
                    else
                    {
                            res.status(401).json({
                                message : "you are not allowed to access this data"
                            });
                    }

                }
                else
                {
                    return res.status(404).json({
                        message: "invalid user id"
                    });
                }
            });
        }
        else if(user_type === 2) //admin profile
        {
            //Check phone availability
            User.find({_id: req.body._id})
            .exec()
            .then( user => {
                if(user.length >= 1)
                {
                    const userId = req.userData.userId;
                    const exp = req.userData.exp;

                    if(userId === req.body._id && exp > 100) //check if correct user is modefing the data
                    {
                        const profile = new AdminProfile({
                            _id: new mongoose.Types.ObjectId(),
                            user: req.body._id,
                            username: req.body.username,
                            phone: req.body.phone,
                            email: req.body.email,
                            about: req.body.about,
                            picture: req.body.picture,
                            date: req.body.date
                        });

                        profile
                        .save()
                        .then(result => {
                            res.status(201).json({
                                message: "Admin Profile Added",
                                createdProfile: result,
                                Request: {
                                    type : "GET",
                                    description: "GET Admin profile",
                                    url: "https://villa-app.herokuapp.com/v1/users/profile"
                                }
                            });
                        })
                        .catch( err => {
                            console.log(err);
                            res.status(500).json({
                                error: err,
                                Request : {
                                    type: "POST",
                                    description: "add new admin profile",
                                    url: "https://villa-app.herokuapp.com/v1/users/profile",
                                    data: {
                                        user: "_id",
                                        usertype: 0,
                                        username: "username",
                                        phone: "if login method is 0 then input phone otherwise just sent pharse 'phone'",
                                        email: "if login method is 1 then input email otherwise just sent pharse 'email'",
                                        about: "this is about admin",
                                        picture: "picture",
                                        date: "19-09-2021"
                                    }
                                }
                            });
                        });
                    }
                    else
                    {
                            res.status(401).json({
                                message : "you are not allowed to access this data"
                            });
                    }
                }
                else
                {
                    return res.status(404).json({
                        message: "invalid user type"
                    });
                }
            });
        }
        else //invalid input
        {
            return res.status(404).json({
                message: "invalid user type"
            });
        }


});


//Get user Profile
router.get('/profile/:userId/:usertype', checkAuth , (req, res, next) => {
    const id = req.params.userId;
    const usertype = Number(req.params.usertype);

    if(usertype === 0)
    {
        const tokenuserId = req.userData.userId;
        const exp = req.userData.exp;

        if(tokenuserId === id && exp > 100) //check if correct user is modefing the data
        {
            GuestProfile.find({user:id})
            .populate('user','_id username usertype phone email login_method login_status verified date')
            .select('about picture')
            .exec()
            .then(doc => {
                if(doc)
                {
                    res.status(200).json({
                        user: doc,
                        Request : {
                            type: "PATCH",
                            description: "update user profile",
                            url: "https://villa-app.herokuapp.com/v1/users/profile/" + id,
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
        else
        {
                res.status(401).json({
                    message : "you are not allowed to access this data"
                });
        }
    }
    else if(usertype === 1)
    {
        const tokenuserId = req.userData.userId;
        const exp = req.userData.exp;

        if(tokenuserId === id && exp > 100) //check if correct user is modefing the data
        {
            HostProfile.find({user:id})
            .populate('user','_id username usertype phone email login_method login_status verified date')
            .select('identity_verification picture')
            .exec()
            .then(doc => {
                if(doc)
                {
                    res.status(200).json({
                        user: doc,
                        Request : {
                            type: "PATCH",
                            description: "update host profile",
                            url: "https://villa-app.herokuapp.com/v1/users/profile/" + id,
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
        else
        {
                res.status(401).json({
                    message : "you are not allowed to access this data"
                });
        }
    }
    else if(usertype === 2)
    {
        const tokenuserId = req.userData.userId;
        const exp = req.userData.exp;

        if(tokenuserId === id && exp > 100) //check if correct user is modefing the data
        {
            AdminProfile.find({user:id})
            .populate('user','_id username usertype phone email login_method login_status verified date')
            .select('about picture')
            .exec()
            .then(doc => {
                if(doc)
                {
                    res.status(200).json({
                        user: doc,
                        Request : {
                            type: "PATCH",
                            description: "update admin profile",
                            url: "https://villa-app.herokuapp.com/v1/users/profile/" + id,
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
        else
        {
                res.status(401).json({
                    message : "you are not allowed to access this data"
                });
        }

    }
    else
    {
        res.status(404).json({
            message : "requested user type not found"
        });
    }

});


//update user profile
router.patch('/profile/:userId', checkAuth , (req, res, next) => {
    const id = req.params.userId;
    var usertype = null;
    const userId = req.userData.userId;
    const exp = req.userData.exp;

    if(userId === id && exp > 100) //check if correct user is modefing the data
    {
        const updateOps ={};
        for (const ops of req.body)
        {
            updateOps[ops.propName] = ops.value;
            usertype= ops.usertype;
        }
        if(usertype === 0)
        {

            GuestProfile.updateOne({user: id} , {$set: updateOps})
            .exec()
            .then(result => {
                res.status(200).json({
                    message: "User profile updated successfully",
                    response : {
                        type : "GET",
                        url : "https://villa-app.herokuapp.com/v1/users/profile/" + id
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
        else if(usertype === 1)
        {
            const updateOps ={};
            for (const ops of req.body)
            {
                updateOps[ops.propName] = ops.value;
            }
            HostProfile.updateOne({user: id} , {$set: updateOps})
            .exec()
            .then(result => {
                res.status(200).json({
                    message: "Host profile updated successfully",
                    response : {
                        type : "GET",
                        url : "https://villa-app.herokuapp.com/v1/users/profile/" + id
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
        else if(usertype === 2)
        {
            const updateOps ={};
            for (const ops of req.body)
            {
                updateOps[ops.propName] = ops.value;
            }
            AdminProfile.updateOne({user: id} , {$set: updateOps})
            .exec()
            .then(result => {
                res.status(200).json({
                    message: "Admin profile updated successfully",
                    response : {
                        type : "GET",
                        url : "https://villa-app.herokuapp.com/v1/users/profile/" + id
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
                message : "requested user type not found"
            });
        }
    }
    else
    {
        res.status(401).json({
            message : "you are not allowed to access this data"
        });
    }
});


router.delete('/profile/:userId', checkAuth ,  (req, res, next) => {
    const userId = req.userData.userId;
    const exp = req.userData.exp;

    if(userId === id && exp > 100) //check if correct user is modefing the data
    {
        res.status(200).json({
            message: "Handling Delete request to /v1/users/profile"
        });
    }
    else
    {
        res.status(401).json({
            message : "you are not allowed to access this data"
        });
    }
});


/*
****************************
     Preferences
 ***************************
 */

 router.post('/preferences', checkAuth, (req, res, next) => {

    /*
    ******************** Signup Method ******************
    * 0 for guest,
    * 1 for host,
    * 2 for admin
    */

    const user_type = req.body.usertype;



    if(user_type === 0) //guest preferences
    {
        //Check user availability
        User.find({_id: req.body.user})
        .exec()
        .then( user => {
            if(user.length >= 1)
            {
                const userId = req.userData.userId;
                const exp = req.userData.exp;

                if(userId === req.body.user && exp > 100) //check if correct user is modefing the data
                {
                    const preference = new GuestPreference({
                        _id: new mongoose.Types.ObjectId(),
                        user: req.body.user,
                        language: req.body.language,
                        notification: req.body.notification,
                        date: req.body.date
                    });

                    preference
                    .save()
                    .then(result => {
                        res.status(201).json({
                            message: "User Preference Added",
                            createdPreferences: result,
                            Request: {
                                type : "GET",
                                description: "GET User preferences",
                                url: "https://villa-app.herokuapp.com/v1/users/preferences"
                            }
                        });
                    })
                    .catch( err => {
                        console.log(err);
                        res.status(500).json({
                            error: err,
                            Request : {
                                type: "POST",
                                description: "add new user preference",
                                url: "https://villa-app.herokuapp.com/v1/users/preferences",
                                data: {
                                    user: "_id",
                                    language: "English",
                                    notification: false,
                                    date: "19-09-2021"
                                }
                            }
                        });
                    });
                }
                else
                {
                    res.status(401).json({
                        message : "you are not allowed to access this data"
                    });
                }
            }
            else
            {
                return res.status(404).json({
                    message: "invalid user id"
                });
            }
        });
    }
    else if(user_type === 1) //host preference
    {
        //Check user availability
        User.find({_id: req.body.user})
        .exec()
        .then( user => {
            if(user.length >= 1)
            {
                const userId = req.userData.userId;
                const exp = req.userData.exp;

                if(userId === req.body.user && exp > 100) //check if correct user is modefing the data
                {
                    const preference = new HostPreference({
                        _id: new mongoose.Types.ObjectId(),
                        user: req.body.user,
                        language: req.body.language,
                        notification: req.body.notification,
                        date: req.body.date
                    });

                    preference
                    .save()
                    .then(result => {
                        res.status(201).json({
                            message: "Host Preference Added",
                            createdPreferences: result,
                            Request: {
                                type : "GET",
                                description: "GET Host preferences",
                                url: "https://villa-app.herokuapp.com/v1/users/preferences"
                            }
                        });
                    })
                    .catch( err => {
                        console.log(err);
                        res.status(500).json({
                            error: err,
                            Request : {
                                type: "POST",
                                description: "add new host preference",
                                url: "https://villa-app.herokuapp.com/v1/users/preferences",
                                data: {
                                    user: "_id",
                                    language: "English",
                                    notification: false,
                                    date: "19-09-2021"
                                }
                            }
                        });
                    });
                }
                else
                {
                    res.status(401).json({
                        message : "you are not allowed to access this data"
                    });
                }
            }
            else
            {
                return res.status(404).json({
                    message: "invalid user id"
                });
            }
        });
    }
    else if(user_type === 2) //admin preference
    {
        //Check user availability
        User.find({_id: req.body.user})
        .exec()
        .then( user => {
            if(user.length >= 1)
            {
                const userId = req.userData.userId;
                const exp = req.userData.exp;

                if(userId === req.body.user && exp > 100) //check if correct user is modefing the data
                {
                    const preference = new AdminPreference({
                        _id: new mongoose.Types.ObjectId(),
                        user: req.body.user,
                        language: req.body.language,
                        notification: req.body.notification,
                        date: req.body.date
                    });

                    preference
                    .save()
                    .then(result => {
                        res.status(201).json({
                            message: "Admin Preference Added",
                            createdPreferences: result,
                            Request: {
                                type : "GET",
                                description: "GET Admin preferences",
                                url: "https://villa-app.herokuapp.com/v1/users/preferences"
                            }
                        });
                    })
                    .catch( err => {
                        console.log(err);
                        res.status(500).json({
                            error: err,
                            Request : {
                                type: "POST",
                                description: "add new Admin preference",
                                url: "https://villa-app.herokuapp.com/v1/users/preferences",
                                data: {
                                    user: "_id",
                                    language: "English",
                                    notification: false,
                                    date: "19-09-2021"
                                }
                            }
                        });
                    });
                }
                else
                {
                    res.status(401).json({
                        message : "you are not allowed to access this data"
                    });
                }
            }
            else
            {
                return res.status(404).json({
                    message: "invalid user id"
                });
            }
        });
    }
    else //invalid input
    {
        return res.status(404).json({
            message: "requested user type not supported"
        });
    }
});



//Get user Preferences
router.get('/preferences/:userId/:usertype', checkAuth , (req, res, next) => {
    const id = req.params.userId;
    const usertype = Number(req.params.usertype);

    if(usertype === 0)///guest preferences
    {
        const tokenuserId = req.userData.userId;
        const exp = req.userData.exp;

        if(tokenuserId === id && exp > 100) //check if correct user is modefing the data
        {
            GuestPreference.find({user:id})
            .populate('user','_id username usertype')
            .select('language notification date')
            .exec()
            .then(doc => {
                if(doc)
                {
                    res.status(200).json({
                        preferences: doc,
                        Request : {
                            type: "PATCH",
                            description: "update user preferences",
                            url: "https://villa-app.herokuapp.com/v1/users/preferences/" + id,
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
        else
        {
            res.status(401).json({
                message : "you are not allowed to access this data"
            });
        }
    }
    else if(usertype === 1)///host preferences
    {
        const tokenuserId = req.userData.userId;
        const exp = req.userData.exp;

        if(tokenuserId === id && exp > 100) //check if correct user is modefing the data
        {
            HostPreference.find({user:id})
            .populate('user','_id username usertype')
            .select('language notification date')
            .exec()
            .then(doc => {
                if(doc)
                {
                    res.status(200).json({
                        preferences: doc,
                        Request : {
                            type: "PATCH",
                            description: "update host preferences",
                            url: "https://villa-app.herokuapp.com/v1/users/preferences/" + id,
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
        else
        {
            res.status(401).json({
                message : "you are not allowed to access this data"
            });
        }
    }
    else if(usertype === 2)///admin preferences
    {
        const tokenuserId = req.userData.userId;
        const exp = req.userData.exp;

        if(tokenuserId === id && exp > 100) //check if correct user is modefing the data
        {
            AdminPreference.find({user:id})
            .populate('user','_id username usertype')
            .select('language notification date')
            .exec()
            .then(doc => {
                if(doc)
                {
                    res.status(200).json({
                        preferences: doc,
                        Request : {
                            type: "PATCH",
                            description: "update admin preferences",
                            url: "https://villa-app.herokuapp.com/v1/users/preferences/" + id,
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
        else
        {
            res.status(401).json({
                message : "you are not allowed to access this data"
            });
        }

    }
    else
    {

    }

});


//update user profile
router.patch('/preferences/:userId', checkAuth , (req, res, next) => {
    const id = req.params.userId;
    var usertype = null;
    const updateOps ={};

    const tokenuserId = req.userData.userId;
    const exp = req.userData.exp;

    if(tokenuserId === id && exp > 100) //check if correct user is modefing the data
    {
        for (const ops of req.body)
        {
            updateOps[ops.propName] = ops.value;
            usertype = ops.usertype;
        }

        if(usertype === 0)//update guest preference
        {
            GuestPreference.updateOne({user: id} , {$set: updateOps})
            .exec()
            .then(result => {
                res.status(200).json({
                    message: "User preferences updated successfully",
                    response : {
                        type : "GET",
                        url : "https://villa-app.herokuapp.com/v1/users/preferences/" + id
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
        else if(usertype === 1)//update host preference
        {
            HostPreference.updateOne({user: id} , {$set: updateOps})
            .exec()
            .then(result => {
                res.status(200).json({
                    message: "Host preferences updated successfully",
                    response : {
                        type : "GET",
                        url : "https://villa-app.herokuapp.com/v1/users/preferences/" + id
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
        else if(usertype === 2)//update admin preference
        {
            AdminPreference.updateOne({user: id} , {$set: updateOps})
            .exec()
            .then(result => {
                res.status(200).json({
                    message: "Admin preferences updated successfully",
                    response : {
                        type : "GET",
                        url : "https://villa-app.herokuapp.com/v1/users/preferences/" + id
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
    }
    else
    {
        res.status(401).json({
            message : "you are not allowed to access this data"
        });
    }

});


router.delete('/preferences/:userId', checkAuth ,  (req, res, next) => {
    const id = req.params.userId;
    const tokenuserId = req.userData.userId;
    const exp = req.userData.exp;

    if(tokenuserId === id && exp > 100) //check if correct user is modefing the data
    {
        res.status(200).json({
            message: "Handling Delete request to /v1/users/preferences"
        });
    }
    else
    {
        res.status(401).json({
            message : "you are not allowed to access this data"
        });
    }
});


module.exports= router;

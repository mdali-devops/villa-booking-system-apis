/*
*************************************************
* Resource name : Villas (Route)
* Version : 1
* Author  : Baaztech
* URL     : https://villa-app.herokuapp.com/v1/villas
*************************************************
*                  Methods
* 1. add new villa => https://villa-app.herokuapp.com/v1/users (POST)
* 2. get all villas =>  https://villa-app.herokuapp.com/v1/users/login (GET)
* 3. update villa => https://villa-app.herokuapp.com/v1/users (PATCH)
* 4. delete villa => https://villa-app.herokuapp.com/v1/users (DELETE)
* 5. Get villa detailes => https://villa-app.herokuapp.com/v1/users (GET)
*************************************************
*/
const express = require('express');
const router = express.Router();
const path = require("path");
const fs = require('fs');

const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/villas/');
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
const checkAuth = require('../../../middleware/check-auth');

//import models
const User = require('../../models/user');
const Villa = require('../../models/villas/villa');
const booking = require('../../models/bookings/bookings');


/*
****************************
     villas
 ***************************
 */



 router.post('/villas/pics/img', checkAuth, upload.array('villaImages', 5), (req, res, next) => {
    const userId = req.userData.userId;
    const exp = req.userData.exp;
    const villaid= req.body.villaId;
    if(exp > 1000)
    {
        User.findOne({_id: userId})
        .select('login_status usertype')
        .exec()
        .then(userloginstatus => {
            if(userloginstatus.login_status === true)
            {
                if(userloginstatus.usertype === 1)
                {
                    var uploadedimages = [];
                    req.files.forEach(element => {
                        uploadedimages.push(element.path);
                    });
                    console.log(uploadedimages);

                    Villa.updateOne({_id: villaid} , {$set: {images: uploadedimages}})
                    .exec()
                    .then(result => {

                        res.status(200).json({
                            message: "Villa Images added successfully"
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err,
                            message: "images upload faild"
                        });
                    });
                }
                else
                {
                    res.status(401).json({
                        error: err,
                        message:"Access Denied!"
                    });
                }
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err,
                message:"failed finding Host profile"
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


router.patch('/villas/pics/img', checkAuth, upload.array('villaImages', 5), (req, res, next) => {
    const userId = req.userData.userId;
    const exp = req.userData.exp;
    const villaid= req.body.villaId;
    if(exp > 1000)
    {
        User.findOne({_id: userId})
        .select('login_status usertype')
        .exec()
        .then(userloginstatus => {
            if(userloginstatus.login_status === true)
            {
                if(userloginstatus.usertype === 1)
                {

                        var uploadedimages = [];
                        req.files.forEach(element => {
                            uploadedimages.push(element.path);
                        });
                        console.log(uploadedimages);
                        if(uploadedimages.length > 0)
                        {

                            Villa.findOne({_id: villaid})
                            .select('images')
                            .exec()
                            .then(profil => {

                                profil.images.forEach(element => {
                                    try {
                                        fs.unlinkSync(element)
                                        //file removed
                                    } catch(err) {
                                        console.error(err)
                                    }
                                });

                                Villa.updateOne({_id: villaid} , {$set: {images: uploadedimages}})
                                .exec()
                                .then(result => {

                                    res.status(200).json({
                                        message: "Villa Images added successfully"
                                    });
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.status(500).json({
                                        error: err,
                                        message: "images upload faild"
                                    });
                                });
                            })
                            .catch(err => {
                                res.status(500).json({
                                    error: err
                                });
                            });

                    }

                }
                else
                {
                    res.status(401).json({
                        error: err,
                        message:"Access Denied!"
                    });
                }
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err,
                message:"failed finding Host profile"
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


 //add villas
 router.post('/',checkAuth, (req, res, next) => {

    /*
    ******************** add villa Method ******************
    */
    const exp = req.userData.exp;
    if(req.body.host === req.userData.userId && exp > 1000) // if user id and token  match
    {
        //Check user availability
        User.find({_id: req.body.host})
        .exec()
        .then( user =>
        {
            const usertype = user[0].usertype;
            if(usertype == 1) //if user is host
            {

                const villa = new Villa({
                    _id: new mongoose.Types.ObjectId(),
                    host: req.body.host,
                    is_featured: req.body.is_featured,
                    title: req.body.title,
                    description: req.body.description,
                    location: req.body.location,
                    address: req.body.address,
                    bedroom: req.body.bedroom,
                    bathroom: req.body.bathroom,
                    place: req.body.place,
                    guests: req.body.guests,
                    images: req.body.images,
                    nightprice: req.body.nightprice,
                    weekendprice: req.body.weekendprice,
                    normalprice: req.body.normalprice,
                    status: req.body.status, //0 for needs approval, 1 for approced , 2 for pennalized , 3 for banned , 4 for deletion bin ,
                    date: req.body.date
                });

                villa
                .save()
                .then(result => {
                    res.status(201).json({
                        message: "Villa Added",
                        createdVilla: result,
                        Request: {
                            type : "POST",
                            description: "add services for villa",
                            url: "https://villa-app.herokuapp.com/v1/villas/services/host"
                        }
                    });
                })
                .catch( err =>{
                    res.status(500).json({
                        error: err,
                        Request : {
                            type: "POST",
                            description: "add new villa",
                            url: "https://villa-app.herokuapp.com/v1/villas",
                            data: {

                                host: "host id",
                                is_featured: false,
                                title: "title",
                                description: "description",
                                location: "location",
                                address: "address",
                                bedroom: 3,
                                bathroom: 3,
                                place: "place",
                                guests: 4,
                                images: "image.png",
                                nightprice: 234,
                                weekendprice: 234,
                                normalprice: 234,
                                status: 0, //0 for needs approval, 1 for approced , 2 for pennalized , 3 for banned , 4 for deletion bin , 5 for requires approval after update ,
                                date: "21-09-2021"
                            }
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
    else //if user id and token not matched
    {
        res.status(401).json({
            message : "Auth failed, you are not allowed to access this data"
        });
    }
});


 //get villa
 router.get('/:villaId',checkAuth, (req, res, next) => {

    /*
    ******************** get villa Method ******************
    */

    const villaId = req.params.villaId;
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
                Villa.find({_id: villaId})
                .select('_id is_featured title description location address bedroom bathroom place guests images nightprice weekendprice normalprice date')
                .populate('host', '_id username phone email')
                .exec()
                .then(villa => {
                    if(villa)
                    {
                        res.status(200).json({
                            hostvilla: villa,
                            Request : {
                                type: "GET",
                                description: "Get host villa service",
                                url: "https://villa-app.herokuapp.com/v1/villas/services/host"
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

 //update villa
 router.patch('/:villaId',checkAuth, (req, res, next) => {

    /*
    ******************** update villa Method ******************
    */

    const villaId = req.params.villaId;
    const userId = req.userData.userId;
    const exp = req.userData.exp;
    const updateOps = {};
    if(exp > 1000) //if token is not expired
    {
        for (const ops of req.body)
        {
            if(ops.propName === "status") //host can not update status and is_featured attribute
            {
                updateOps[ops.propName] = 5; //requires approval after update
            }
            else if(ops.propName === "is_featured") //host can not update is_featured attribute
            {

            }
            else
            {
                updateOps[ops.propName] = ops.value;
            }

        }
        //check user availability
        User.find({_id: userId})
        .exec()
        .then( host =>{
            if(host[0].usertype === 1) //if it is host
            {
                Villa.updateOne({_id: villaId} , {$set: updateOps})
                .exec()
                .then(result => {

                    res.status(200).json({
                        message: "Host villa Service updated successfully",
                        response : {
                            type : "GET",
                            url : "https://villa-app.herokuapp.com/v1/villas/services/host"
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


 //delete villa
 router.delete('/:villaId',checkAuth, (req, res, next) => {

    /*
    ******************** delete villa Method ******************
    */


    const villaId = req.params.villaId;
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
                Villa.deleteOne({_id: villaId})
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: "Host villa deleted",
                        response: {
                            type: 'POST',
                            description: "add new villa",
                            url: 'https://villa-app.herokuapp.com/v1/villas'
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


//get all host villas
router.get('/host/getall' , checkAuth , (req, res, next) => {

    /*
    ******************** get all host villas  Method ******************
    */
    const userId = req.userData.userId;
    const exp = req.userData.exp;

    if(exp > 1000) //if token is not expired
    {
        //check user availability
        User.find({_id: userId})
        .exec()
        .then( user =>{

            Villa.find({host: userId})
            .select('_id is_featured title description location address bedroom bathroom place guests images nightprice weekendprice normalprice date')
            .populate('host', '_id username phone email')
            .exec()
            .then(hostvillas => {
                const response = {
                    count: hostvillas.length,
                    villas: hostvillas.map(villa => {
                        return {
                            _id : villa._id,
                            is_featured : villa.is_featured,
                            title : villa._id,
                            description : villa.description,
                            host : villa.host,
                            location : villa.location,
                            address : villa.address,
                            bedroom : villa.bedroom,
                            bathroom : villa.bathroom,
                            place : villa.place,
                            guests : villa.guests,
                            images : villa.images,
                            nightprice : villa.nightprice,
                            weekendprice : villa.weekendprice,
                            normalprice : villa.normalprice,
                            date : villa.date,
                            request: {
                                type: 'GET',
                                url: 'https://villa-app.herokuapp.com/v1/villas/services/host'
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



//get all villas admin
router.get('/admin/getall' , checkAuth , (req, res, next) => {

    /*
    ******************** get all villas  Method (Admin) ******************
    */
    const userId = req.userData.userId;
    const exp = req.userData.exp;

    if(exp > 1000) //if token is not expired
    {
        //check user availability
        User.find({_id: userId})
        .exec()
        .then( user =>{

            Villa.find()
            .select('_id is_featured title description location address bedroom bathroom place guests images nightprice weekendprice normalprice date')
            .populate('host', '_id username phone email')
            .exec()
            .then(adminvillas => {
                const response = {
                    count: adminvillas.length,
                    villas: adminvillas.map(villa => {
                        return {
                            _id : villa._id,
                            is_featured : villa.is_featured,
                            title : villa._id,
                            description : villa.description,
                            host : villa.host,
                            location : villa.location,
                            address : villa.address,
                            bedroom : villa.bedroom,
                            bathroom : villa.bathroom,
                            place : villa.place,
                            guests : villa.guests,
                            images : villa.images,
                            nightprice : villa.nightprice,
                            weekendprice : villa.weekendprice,
                            normalprice : villa.normalprice,
                            date : villa.date,
                            request: {
                                type: 'GET',
                                url: 'https://villa-app.herokuapp.com/v1/villas/services/host'
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





//update villa
router.patch('/admin/:villaId',checkAuth, (req, res, next) => {

    /*
    ******************** update villa Method ******************
    */

    const villaId = req.params.villaId;
    const userId = req.userData.userId;
    const exp = req.userData.exp;
    const villastatus = req.body.status;
    if(exp > 1000) //if token is not expired
    {
        //check user availability
        User.find({_id: userId})
        .exec()
        .then( admin =>{
            if(admin[0].usertype === 2) //if it is admin
            {
                Villa.updateOne({_id: villaId} , {$set: {status: villastatus}})
                .exec()
                .then(result => {

                    res.status(200).json({
                        message: "villa Status updated successfully by admin",
                        response : {
                            type : "GET",
                            url : "https://villa-app.herokuapp.com/v1/villas/" + villaId
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





//get all villas Guest filtered
router.get('/guest/getall/filtered/:address/:guests/:rooms/:start_price/:end_price/:sdate/:edate' , checkAuth , (req, res, next) => {
/*
Data Inputs
1. Address
2. Guests
3. Rooms
4. Starting price
5. Ending price
6. Starting and ending date   (check from booking table to check availability of villa)
*/

/*
    ******************** get all filters villas  Method (Guest) ******************
    */

    const userId = req.userData.userId;
    const exp = req.userData.exp;


    if(exp > 1000) //if token is not expired
    {
        // input data
        const addres = req.params.address;
        const guest = req.params.guests;
        const rooms = req.params.rooms;
        const sprice = req.params.start_price;
        const eprice = req.params.end_price;
        const sdate = req.params.sdate;
        const edate = req.params.edate;

        //check user availability
        User.find({_id: userId})
        .exec()
        .then( user =>{

            Villa.find({normalprice :{$gte: sprice, $lte:eprice}, guests: guest, bedroom: rooms, address: {$regex: '.*' + addres + '.*' }})
            .select('_id is_featured title description location address bedroom bathroom place guests images nightprice weekendprice normalprice date')
            .populate('host', '_id username phone email')
            .exec()
            .then(guestvillas => {
                // i edited here
                var villadata = [];
                guestvillas.forEach(element => {
                        booking.find({villa : element._id , startdate : {$gte: sdate}, enddate:{$lte: edate}})
                        .select('_id')
                        .exec()
                        .then(bookingvilla => {
                            console.log(element);
                            check= bookingvilla.length;
                            if(check == 0)
                            {
                                var test = [element]
                                villadata.push(test);
                            }
                            console.log(bookingvilla.length);
                        });
                    console.log(villadata);
                });

                // edit ends here
                const response = {
                    count: guestvillas.length,
                    villas: guestvillas.map(villa => {
                        return {
                            _id : villa._id,
                            is_featured : villa.is_featured,
                            title : villa.title,
                            description : villa.description,
                            host : villa.host,
                            location : villa.location,
                            address : villa.address,
                            bedroom : villa.bedroom,
                            bathroom : villa.bathroom,
                            place : villa.place,
                            guests : villa.guests,
                            images : villa.images,
                            nightprice : villa.nightprice,
                            weekendprice : villa.weekendprice,
                            normalprice : villa.normalprice,
                            date : villa.date,
                            request: {
                                type: 'GET',
                                url: 'https://villa-app.herokuapp.com/v1/villas/services/host'
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


//get all villas Guest
router.get('/guest/getall' , checkAuth , (req, res, next) => {

    /*
    ******************** get all villas  Method (Guest) ******************
    */
    const userId = req.userData.userId;
    const exp = req.userData.exp;

    if(exp > 1000) //if token is not expired
    {
        //check user availability
        User.find({_id: userId})
        .exec()
        .then( user =>{

            Villa.find({status: 1})
            .select('_id is_featured title description location address bedroom bathroom place guests images nightprice weekendprice normalprice date')
            .populate('host', '_id username phone email')
            .exec()
            .then(guestvillas => {
                const response = {
                    count: guestvillas.length,
                    villas: guestvillas.map(villa => {
                        return {
                            _id : villa._id,
                            is_featured : villa.is_featured,
                            title : villa.title,
                            description : villa.description,
                            host : villa.host,
                            location : villa.location,
                            address : villa.address,
                            bedroom : villa.bedroom,
                            bathroom : villa.bathroom,
                            place : villa.place,
                            guests : villa.guests,
                            images : villa.images,
                            nightprice : villa.nightprice,
                            weekendprice : villa.weekendprice,
                            normalprice : villa.normalprice,
                            date : villa.date,
                            request: {
                                type: 'GET',
                                url: 'https://villa-app.herokuapp.com/v1/villas/services/host'
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

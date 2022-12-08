/*
*************************************************
* Resource name : User (Model)
* Version : 1
* Author  : Baaztech
* URL     : url i.e https://villa-app.herokuapp.com/
*************************************************
*                  Methods
* 1. add new user => /v1/users (POST)
* 2. Login User =>  /v1/users/login (POST)
*************************************************
*/
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: {type: String, required: true},
    usertype: {type:Number, required: true},
    phone: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    login_method: {type: Number, required:true},
    login_status: {type:Boolean, required: true},
    verified: {type: Boolean, required: true},
    date: {type:String, required: true}
});

module.exports = mongoose.model('User',userSchema);
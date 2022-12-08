/*
*************************************************
* Resource name : guestProfile (Model)
* Version : 1
* Author  : Baaztech
* URL     : url i.e https://villa-app.herokuapp.com/
*************************************************
*                  Methods
* 1. add guest profile => /v1/users/profile (POST)
* 2. get guest profile =>  /v1/users/profile (GET)
* 3. delete guest profile =>  /v1/users/profile (DELETE)
* 4. update guest profile =>  /v1/users/profile (PATCH)
*************************************************
*/
const mongoose = require('mongoose');

const guestprofileSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User',  required:true},
    username: {type: String, required: true},
    phone: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    about: {type: String, required: true},
    picture: {type: String, required:true},
    date: {type:String, required: true}
});

module.exports = mongoose.model('GuestProfile',guestprofileSchema);
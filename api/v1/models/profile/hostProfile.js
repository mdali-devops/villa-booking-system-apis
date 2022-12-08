/*
*************************************************
* Resource name : hostProfile (Model)
* Version : 1
* Author  : Baaztech
* URL     : url i.e https://villa-app.herokuapp.com/
*************************************************
*                  Methods
* 1. add host profile => /v1/users/profile (POST)
* 2. get host profile =>  /v1/users/profile (GET)
* 3. delete host profile =>  /v1/users/profile (DELETE)
* 4. update host profile =>  /v1/users/profile (PATCH)
*************************************************
*/
const mongoose = require('mongoose');

const hostprofileSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User',  required:true},
    username: {type: String, required: true},
    phone: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    identity_verification: {type: Boolean, required: true},
    picture: {type: String, required:true},
    date: {type:String, required: true}
});

module.exports = mongoose.model('HostProfile',hostprofileSchema);
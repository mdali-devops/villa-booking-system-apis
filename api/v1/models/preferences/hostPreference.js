/*
*************************************************
* Resource name : Host Preferences (Model)
* Version : 1
* Author  : Baaztech
* URL     : url i.e https://villa-app.herokuapp.com/
*************************************************
*                  Methods
* 1. add host preferences => /v1/users/preferences (POST)
* 2. update host preferences =>  /v1/users/preferences (PATCH)
*************************************************
*/
const mongoose = require('mongoose');

const hostpreferenceSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User',  required:true},
    language: {type:String, required: true},
    notification: {type: Boolean, required: true},
    date: {type:String, required: true}
});

module.exports = mongoose.model('HostPreference',hostpreferenceSchema);
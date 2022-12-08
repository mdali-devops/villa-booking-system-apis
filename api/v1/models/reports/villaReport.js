/*
*************************************************
* Resource name : Villa Reports (Model)
* Version : 1
* Author  : Baaztech
* URL     : url i.e https://villa-app.herokuapp.com/
*************************************************
*                  Methods
* 1. add new villa report => /v1/reports/villa (POST)
* 2. get single villa report  => /v1/reports/villa/id (GET)
* 3. Get all villa reports for guest => /v1/reports/villa/guest/getall (GET)
* 4. Get all villa reports for admin => /v1/reports/villa/admin/getall (GET)
* 5. update villa report status, actionTaken => /v1/reports/villa/id (Patch)
*************************************************
*/

const mongoose = require('mongoose');

const villareportsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User',  required:true},
    villa: {type: mongoose.Schema.Types.ObjectId, ref: 'Villa',  required:true},
    reason: {type:String, required: true},
    title: {type:String, required: true},
    description: {type:String, required: true},
    actionTaken: {type:String},
    userReview: {type: String},
    status: {type:Number, required: true}, //0 for open, 1 for closed
    date: {type:String, required: true}
});

module.exports = mongoose.model('VillaReports',villareportsSchema);
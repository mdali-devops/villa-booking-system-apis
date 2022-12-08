/*
*************************************************
* Resource name : Host Reports (Model)
* Version : 1
* Author  : Baaztech
* URL     : url i.e https://villa-app.herokuapp.com/
*************************************************
*                  Methods
* 1. add new Host report => /v1/reports/host (POST)
* 2. get single host report  => /v1/reports/host/id (GET)
* 3. Get all host reports for guest => /v1/reports/host/guest/getall (GET)
* 4. Get all host reports for admin => /v1/reports/host/admin/getall (GET)
* 5. update host report status, actionTaken => /v1/reports/host/id (Patch)
*************************************************
*/

const mongoose = require('mongoose');

const hostreportsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User',  required:true},
    host: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    reason: {type:String, required: true},
    title: {type:String, required: true},
    description: {type:String, required: true},
    actionTaken: {type:String},
    userReview: {type: String},
    status: {type:Number, required: true}, //0 for open, 1 for closed
    date: {type:String, required: true}
});

module.exports = mongoose.model('HostReports',hostreportsSchema);
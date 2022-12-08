/*
*************************************************
* Resource name : Bookings (Model)
* Version : 1
* Author  : Baaztech
* URL     : url i.e https://villa-app.herokuapp.com/
*************************************************
*                  Methods
* 1. add new booking request => /v1/bookings (POST)
* 2. Update request status to booking  =>  /v1/bookings/id (Patch)
* 3. Get all bookings for guest  =>  /v1/bookings/userid (GET)
* 4. Get all bookings for villa  =>  /v1/bookings/villaid (GET)
* 4. Get all bookings for host  =>  /v1/bookings/hostid (GET)
*************************************************
*/
const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guest : {type: mongoose.Schema.Types.ObjectId, ref: 'User',required: true},
    villa: {type: mongoose.Schema.Types.ObjectId, ref: 'Villa',required: true},
    host: {type: mongoose.Schema.Types.ObjectId, ref: 'User',required: true},
    guests: {type: Number, required: true},
    total: {type: Number, required: true},
    rooms: {type:Number, required: true},
    status: {type: Number, required:true}, //0 for request , 1 for waiting guest approval, 2 for active booking , 3 for completed , 4 for cancelled
    startdate: {type:String, required: true},
    enddate: {type:String, required: true},
    date: {type:String, required: true}
});

module.exports = mongoose.model('Booking',bookingSchema);
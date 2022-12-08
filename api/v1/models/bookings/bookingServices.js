/*
*************************************************
* Resource name : booking services (Model)
* Version : 1
* Author  : Baaztech
* URL     : url i.e https://villa-app.herokuapp.com/
*************************************************
*                  Methods
* 1. add booking  service => /v1/bookings/services (POST)
* 2. get booking service  =>  /v1/bookings/services/id (GET)
* 3. delete booking service =>  /v1/bookings/services/id (DELETE)
* 4. get all booking services  =>  /v1/bookings/services/getall (GET)
*************************************************
*/
const mongoose = require('mongoose');

const bookingservicesSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    booking: {type: mongoose.Schema.Types.ObjectId, ref: 'Booking',required: true},
    service_id: {type: mongoose.Schema.Types.ObjectId, ref: 'HostVillaServices',required: true},
    date: {type:String, required: true}
});

module.exports = mongoose.model('BookingServices',bookingservicesSchema);
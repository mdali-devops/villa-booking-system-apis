/*
*************************************************
* Resource name : Host Reviews (Model)
* Version : 1
* Author  : Baaztech
* URL     : url i.e https://villa-app.herokuapp.com/
*************************************************
*                  Methods
* 1. add new host reviews => /v1/reviews/host (POST)
* 2. get single host review => /v1/reviews/host/single/reviewId (GET)
* 3. Get host all reviews => /v1/reviews/host/getall/guestId (GET)
* 4. get host reviews by booking id => /v1/reviews/host/booking/bookingId (GET)
* 5. get host reviews by villa id => /v1/reviews/host/villa/villaId (GET)
*************************************************
*/

const mongoose = require('mongoose');

const hostReviewSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    host: {type: mongoose.Schema.Types.ObjectId, ref: 'User',  required:true},
    guest: {type: mongoose.Schema.Types.ObjectId, ref: 'User',  required:true},
    booking: {type: mongoose.Schema.Types.ObjectId, ref: 'Booking',required: true, unique: true},
    villa: {type: mongoose.Schema.Types.ObjectId, ref: 'Villa',required: true},
    comment: {type: String},
    rating: {type: Number, required: true},
    date: {type:String, required: true}
});

module.exports = mongoose.model('HostReview',hostReviewSchema);
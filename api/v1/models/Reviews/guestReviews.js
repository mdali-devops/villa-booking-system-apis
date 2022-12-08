/*
*************************************************
* Resource name : Guest Reviews (Model)
* Version : 1
* Author  : Baaztech
* URL     : url i.e https://villa-app.herokuapp.com/
*************************************************
*                  Methods
* 1. add new guest reviews => /v1/reviews/guest (POST)
* 2. get single guest review => /v1/reviews/guest/single/reviewId (GET)
* 3. Get guest all reviews => /v1/reviews/guest/getall/guestId (GET)
* 4. get guest review by booking id => /v1/reviews/guest/booking/bookingId (GET)
*************************************************
*/

const mongoose = require('mongoose');

const guestReviewSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guest: {type: mongoose.Schema.Types.ObjectId, ref: 'User',  required:true},
    host: {type: mongoose.Schema.Types.ObjectId, ref: 'User',  required:true},
    booking: {type: mongoose.Schema.Types.ObjectId, ref: 'Booking',required: true, unique: true},
    villa: {type: mongoose.Schema.Types.ObjectId, ref: 'Villa',required: true},
    comment: {type: String},
    rating: {type: Number, required: true},
    date: {type:String, required: true}
});

module.exports = mongoose.model('GuestReview',guestReviewSchema);
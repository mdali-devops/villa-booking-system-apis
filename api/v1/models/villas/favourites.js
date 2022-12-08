/*
*************************************************
* Resource name : Favourites villas for Guest (Model)
* Version : 1
* Author  : Baaztech
* URL     : url i.e https://villa-app.herokuapp.com/
*************************************************
*                  Methods
* 1. add villa to favourites => /v1/villas/favourites (POST)
* 2. get favourite villas for guest  =>  /v1/villas/favourites (GET)
* 3. delete villa from favourites =>  /v1/villas/favourites/id (DELETE)
*************************************************
*/
const mongoose = require('mongoose');

const favouritevillasSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guest : {type: mongoose.Schema.Types.ObjectId, ref: 'User',required: true},
    villa: {type: mongoose.Schema.Types.ObjectId, ref: 'Villa',required: true},
    date: {type:String, required: true}
});

module.exports = mongoose.model('Favouritevillas',favouritevillasSchema);
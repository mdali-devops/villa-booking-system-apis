/*
*************************************************
* Resource name : villa (Model)
* Version : 1
* Author  : Baaztech
* URL     : url i.e https://villa-app.herokuapp.com/
*************************************************
*                  Methods
* 1. add villa => /v1/villas (POST)
* 2. get villa  =>  /v1/villas/id (GET)
* 3. delete villa =>  /v1/villas/id (DELETE)
* 4. update villa =>  /v1/villas/id (PATCH)
*************************************************
*/
const mongoose = require('mongoose');

const villaSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    host: {type: mongoose.Schema.Types.ObjectId, ref: 'User',  required:true},
    is_featured: {type: Boolean , required: true, default: false},
    title: {type: String, required: true},
    description: {type: String, required: true},
    location: {type: String, required: true},
    address: {type: String, required: true},
    bedroom: {type: Number, required: true},
    bathroom: {type: Number, required: true},
    place: {type: String, required: true},
    guests: {type: String, required: true},
    images: {type: [], required: true},
    nightprice: {type: Number, required: true},
    weekendprice: {type: Number, required: true},
    normalprice: {type: Number, required: true},
    status: {type: Number , required: true, default: 0}, //0 for needs approval, 1 for approced , 2 for pennalized , 3 for banned , 4 for deletion bin ,
    date: {type:String, required: true}
});

module.exports = mongoose.model('Villa',villaSchema);
/*
*************************************************
* Resource name : Host villa services (Model)
* Version : 1
* Author  : Baaztech
* URL     : url i.e https://villa-app.herokuapp.com/
*************************************************
*                  Methods
* 1. add villa  service => /v1/villas/services/admin (POST)
* 2. get villa service  =>  /v1/villas/services/admin/id (GET)
* 3. delete villa service =>  /v1/villas/services/admin/id (DELETE)
* 4. update villa service =>  /v1/villas/services/admin/id (PATCH)
* 5. get all villa services  =>  /v1/villas/services/admin (GET)
*************************************************
*/
const mongoose = require('mongoose');

const hostvillaservicesSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    villa : {type: mongoose.Schema.Types.ObjectId, ref: 'Villa',required: true},
    service_id: {type: mongoose.Schema.Types.ObjectId, ref: 'AdminVillaServices',required: true},
    price: {type: Number , required: true},
    pool_size : {type: String, default: null},
    date: {type:String, required: true}
});

module.exports = mongoose.model('HostVillaServices',hostvillaservicesSchema);
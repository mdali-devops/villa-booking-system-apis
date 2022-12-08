/*
*************************************************
* Resource name : Support Tickets (Model)
* Version : 1
* Author  : Baaztech
* URL     : url i.e https://villa-app.herokuapp.com/
*************************************************
*                  Methods
* 1. add new ticket => /v1/support/tickets (POST)
* 2. get single ticket  => /v1/support/tickets/ticketId (GET)
* 3. Get all tickets => /v1/support/tickets/getall/userId (GET)
* 4. update ticket status => /v1/support/tickets/ticketId (Patch)
*************************************************
*/

const mongoose = require('mongoose');

const ticketsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    ticketnumber: {type:String, required: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User',  required:true},
    reason: {type:String, required: true},
    title: {type:String, required: true},
    description: {type:String, required: true},
    status: {type:Number, required: true}, //0 for open, 1 for closed
    date: {type:String, required: true}
});

module.exports = mongoose.model('Tickets',ticketsSchema);
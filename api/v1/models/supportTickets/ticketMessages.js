/*
*************************************************
* Resource name : Support Ticket Messages (Model)
* Version : 1
* Author  : Baaztech
* URL     : url i.e https://villa-app.herokuapp.com/
*************************************************
*                  Methods
* 1. add new ticket nessage => /v1/support/tickets/messages (POST)
* 2. get single ticket message  => /v1/support/tickets/messages/messageId (GET)
* 3. Get all ticket messages  => /v1/support/tickets/messages/getall/ticketId (GET)
*************************************************
*/

const mongoose = require('mongoose');

const ticketMessagesSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    ticket: {type: mongoose.Schema.Types.ObjectId, ref: 'Tickets',  required:true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User',  required:true},
    usertype: {type: Number, required: true}, //0 for guest, 2 for admin
    message: {type: String, required: true},
    time: {type: String, required: true},
    date: {type:String, required: true}
});

module.exports = mongoose.model('TicketMessages',ticketMessagesSchema);
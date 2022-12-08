/*
*************************************************
* Resource name : chats (Model)
* Version : 1
* Author  : Baaztech
* URL     : url i.e https://villa-app.herokuapp.com/
*************************************************
*                  Methods
* 1. add new chat => /v1/chats/guest (POST)
* 2. get single chat  => /v1/chats/chatId (GET)
* 3. Get guest all chats => /v1/chats/guest/getall/guestId (GET)
* 4. Get host all chats => /v1/chats/host/getall/hostId (GET)
*************************************************
*/

const mongoose = require('mongoose');

const chatsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    host: {type: mongoose.Schema.Types.ObjectId, ref: 'User',  required:true},
    guest: {type: mongoose.Schema.Types.ObjectId, ref: 'User',  required:true},
    booking: {type: mongoose.Schema.Types.ObjectId, ref: 'Booking',required: true},
    token: {type: String, required: true, unique: true},
    date: {type:String, required: true}
});

module.exports = mongoose.model('Chats',chatsSchema);
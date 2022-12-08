/*
*************************************************
* Resource name : chatMessages (Model)
* Version : 1
* Author  : Baaztech
* URL     : url i.e https://villa-app.herokuapp.com/
*************************************************
*                  Methods
* 1. add new chat message => /v1/chats/chatmessage (POST)
* 2. get single chat message => /v1/chats/chatmessage/chatmessageId (GET)
* 3. Get all chat messages => /v1/chats/chatmessage/getall/chatId (GET)
*************************************************
*/

const mongoose = require('mongoose');

const chatMessageSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required : true},
    usertype: {type: Number, required: true}, //0 for guest, 1 for host
    chat: {type: mongoose.Schema.Types.ObjectId, ref: 'Chats',  required:true},
    message: {type: String, required: true},
    time: {type: String, required: true},
    date: {type:String, required: true}
});

module.exports = mongoose.model('ChatMessages',chatMessageSchema);
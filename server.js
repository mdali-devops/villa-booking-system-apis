/*
*************************************************
* Resource name : Startup file
* Version : 1
* Author  : Baaztech
* URL     : url i.e https://villa-app.herokuapp.com/
*************************************************
*                  Resources
* 1.server
* 2. app.js
*************************************************
*/

require('dotenv').config();
//package for mongoose driver
const mongoose = require('mongoose');
//required packages
const http = require('http');
const app = require('./app');


const connectDB = async () => {
    try {
      const conn = await mongoose.connect('mongodb+srv://mdali-devops:'+process.env.MONGO_ATLAS_PW+'@villa-booking-system.k5h7zrv.mongodb.net/?retryWrites=true&w=majority', {
        // useMongoClient: true
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }
 
const port = process.env.PORT || 3000;

const server = http.createServer(app);

//Connect to the database before listening
connectDB().then(() => {
    server.listen(port, () => {
        console.log("server started successfully");
    });
})

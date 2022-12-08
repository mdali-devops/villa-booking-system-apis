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
//required packages
const http = require('http');
const app = require('./app');

const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port);
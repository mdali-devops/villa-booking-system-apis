/*
*************************************************
* Resource name : Check Auth (Moddleware)
* Version : 1
* Author  : Baaztech
* URL     : url i.e https://villa-app.herokuapp.com/
*************************************************
*                  Methods
* 1.
*************************************************
*/

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

    //Get Auth header value
    const bearerHeader = req.headers['authorization'];


    try {
        //split the authorization header
        const bearer = bearerHeader.split(' ');
        //get the token
        const token = bearer[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message : "Auth Failed"
        });
    }

};
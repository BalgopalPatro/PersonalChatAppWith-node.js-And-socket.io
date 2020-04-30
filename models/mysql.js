const mysql = require('mysql')
module.exports.connection  = mysql.createConnection({
    "host" : "localhost",
    "user" : "BG",
    "password" : "Balgopal@123",
    "database" : "mychatapp",
  });
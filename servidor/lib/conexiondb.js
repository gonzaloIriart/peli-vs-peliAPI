var mysql = require('mysql');

var connection = mysql.createConnection(
    {
        host     : 'localhost',
        user     : 'root',
        password : 'root',
        database: 'competencias',
        port: 3306,
      }
);
module.exports = connection;
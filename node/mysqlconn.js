/**
 * Created by fastjur on 14-1-16.
 */

var mysql = require('mysql');

var connection = mysql.createConnection({
    host: "localhost",
    user: "todo",
    password: "ybX7TfyfKaLwbKAF",
    database: "todo"
});
connection.connect();

module.exports.connection = connection;
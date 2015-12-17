/**
 * Created by Jurriaan on 4-12-2015.
 * Server node file
 */
var d = new Date();
var t = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
console.log("Server started\n" + t);

var http = require('http'),
    url = require('url'),
    express = require('express'),
    mysql = require('mysql'),
    app = express(),
    bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(express.static(__dirname + "/../"));

var connection = mysql.createConnection({
    host: "localhost",
    user: "todo",
    password: "ybX7TfyfKaLwbKAF",
    database: "todo"
});
connection.connect();

http.createServer(app).listen(3030);
console.log("Listening on port 3030");

app.get("/alltodos", function (req, res) {
    console.log("Recieved /alltodos");
    connection.query("SELECT Id, Title, Text, DueDate, Completed, Priority FROM todoitem", function(err, rows) {
        if(!err) {
            var todos = [];
            for (var i in rows) {
                var todo = {
                    id: rows[i].Id,
                    title: rows[i].Title,
                    text: rows[i].Text,
                    duedate: new Date(rows[i].DueDate).getTime() / 1000,
                    done: rows[i].Completed,
                    priority: rows[i].Priority
                };
                todos.push(todo);
            }
            res.json(todos);
        } else {
            console.log("alltodos query error!");
        }
    });
});

app.get("/addtodo", function(req, res) {
    var url_parts = url.parse(req.url, true),
        query = url_parts.query;
    if(query["title"] !== undefined && query["text"] !== undefined && query["duedate"] !== undefined &&
        query["done"] !== undefined && query["priority"] !== undefined) {
        connection.query("INSERT INTO todoitem(Title, Text, DueDate, Completed, Priority) VALUES (\""+query["title"]+"\",\""+
            query["text"]+"\",\""+query["duedate"]+"\",\""+query["done"]+"\",\""+query["priority"]+"\")", function(err, data) {
            if(err){
                console.log("Addtodo error", err);
                res.writeHeader(200);
                res.end(data);
            } else {
                res.writeHeader(200);
                res.end("true");
            }
        });
    }
});

app.get("/removetodo", function(req, res) {
    console.log("Received /removetodo");
    var url_parts = url.parse(req.url, true),
        query = url_parts.query;
    if(query["id"] !== undefined) {
        connection.query("DELETE FROM todoitem WHERE id = ?", query["id"], function(err, data) {
           if(err) {
               console.log("Remove todo error", err);
               res.writeHeader(200);
               res.end("false");
           } else {
               res.writeHeader(200);
               res.end("true");
           }
        });
    } else {
        res.writeHeader(200);
        res.end("false");
    }
});

app.get("/updatetodo", function(req, res) {
    console.log("Received /updatetodo");
    var url_parts = url.parse(req.url, true),
        query = url_parts.query,
        mysqlQuery = "UPDATE todoitem SET Title=\""+query["title"]+"\", Text=\""+query["text"]+"\"," +
            " DueDate="+query["duedate"]+", Completed=\""+query["done"]+"\","+" Priority=\""+query["priority"]+"\" WHERE" +
    " Id=\""+query["id"]+"\"";
    console.log(mysqlQuery);
    connection.query(mysqlQuery, function(err, data) {
        if(err) {
            console.log("Update Todo error", err);
            res.writeHeader(200);
            res.end("false");
        } else {
            res.writeHeader(200);
            res.end("true");
        }
    })
});
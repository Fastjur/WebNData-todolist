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
app.use(express.static("..\\" +__dirname));

http.createServer(app).listen(3030);
console.log("Listening on port 3030");

var todos = [],
    t1 = {
        text: "This is a Note",
        priority: 0
    },
    t2 = {
        text: "This is a Low",
        priority: 1
    },
    t3 = {
        text: "This is a Medium",
        priority: 2
    },
    t4 = {
        text: "This is a High",
        priority: 3
    };
todos.push(t1);
todos.push(t2);
todos.push(t3);
todos.push(t4);

app.get("/alltodos", function (req, res) {
    res.json(todos);
    console.log("Recieved /alltodos");
});

app.get("/addtodo", function(req, res) {
    var url_parts = url.parse(req.url, true),
        query = url_parts.query;
    if(query["text"] !== undefined && query["priority"] !== undefined) {
        var todo = {
            text: query["text"],
            priority: query["priority"]
        };
        todos.push(todo);
    }
    console.log("Recieved /addtodo");
    res.writeHeader(200);
    res.end("true");
});

app.get("/removetodo", function(reg, res) {
    var url_parts = url.parse(req.url, true),
        query = url_parts.query;
    if(query["id"] !== undefined) {
        todos.splice(query["id"], 1);
    }
});

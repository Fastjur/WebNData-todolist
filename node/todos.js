/**
 * Created by fastjur on 14-1-16.
 */

var db = require("./mysqlconn.js");
var url = require("url");

var getAllTodos = function(res) {
    db.connection.query("SELECT Id, Title, Text, DueDate, Completed, Priority FROM ToDoItem;", function(err, rows) {
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
            res.render('todos', {todo_array: todos});
            //res.json(todos);
        } else {
            console.log("alltodos query error", err);
        }
    });
};

var addTodo = function(req, res) {
    var url_parts = url.parse(req.url, true),
        query = url_parts.query;
    if(query["title"] !== undefined && query["text"] !== undefined && query["duedate"] !== undefined &&
        query["done"] !== undefined && query["priority"] !== undefined) {
        db.connection.query("INSERT INTO ToDoItem(Title, Text, DueDate, Completed, Priority) VALUES (\""+query["title"]+"\",\""+
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
};

var removeTodo = function(req, res) {
    var url_parts = url.parse(req.url, true),
        query = url_parts.query;
    if(query["id"] !== undefined) {
        db.connection.query("DELETE FROM ToDoItem WHERE id = ?", query["id"], function(err, data) {
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
};

var updateTodo = function(req, res) {
    var url_parts = url.parse(req.url, true),
        query = url_parts.query,
        mysqlQuery = "UPDATE ToDoItem SET Title=\""+query["title"]+"\", Text=\""+query["text"]+"\"," +
            " DueDate=\""+query["duedate"]+"\", Completed=\""+query["done"]+"\","+" Priority=\""+query["priority"] +
            "\" " +"WHERE Id=\""+query["id"]+"\"";
    db.connection.query(mysqlQuery, function(err, data) {
        if(err) {
            console.log("Update Todo error", err);
            res.writeHeader(200);
            res.end("false");
        } else {
            res.writeHeader(200);
            res.end("true");
        }
    })
};

module.exports.getAllTodos = getAllTodos;
module.exports.addTodo = addTodo;
module.exports.removeTodo = removeTodo;
module.exports.updateTodo = updateTodo;
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
        connection.query("INSERT INTO todo(Title, Text, DueDate, Completed, Priority) VALUES (?,?,?,?,?)",
            [query["title"], query["text"], query["duedate"], query["done"], query["priority"]], function(err, response) {
                if(err){
                    console.log("Insert query error!");
                    res.writeHeader(422);
                    res.end(err);
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
        todos.splice(query["id"], 1);
        res.writeHeader(200);
        res.end("true");
    } else {
        res.writeHeader(200);
        res.end("false");
    }
});

app.get("/dashboard", function(req, res) {
    console.log("Recieved /dashboard");
    var url_parts = url.parse(req.url, true),
        query = url_parts.query;

    var numToDosPerTag, numToDosLongComplete, averageCompletionTime, listsWithTag;

    connection.query(
        "SELECT tag.text, COUNT(item.Completed) " +
        "FROM ToDoItem item, ItemTag iTag, Tag tag " +
        "WHERE iTag.ToDoId = item.Id " +
            "AND iTag.TagId = tag.Id " +
        "GROUP BY tag.text;"
        , function(err, rows, fields) {
            if (err){
                console.log("error trying to get pending todos per Tag");
                res.writeHeader(442);
                res.end(err);
            } else {
                numToDosPerTag = rows;
            }
        }
    );

    connection.query(
        "SELECT list.name, item.Title" +
        "FROM ToDoList list, ToDoItem item" +
        "WHERE" +
            "item.CompletionDate > item.CreationDate"+
            "AND list.Name LIKE \"Shared\"" +
            "AND DATEDIFF(item.CompletionDate, item.CreationDate) >" +
                "(SELECT AVG(DATEDIFF(listItem.CompletionDate, listItem.CreationDate))" +
                "FROM ToDoItem listItem" +
                "WHERE" +
                    "list.Id = listItem.ToDoListId" +
                    "AND list.Name LIKE \"Shared\")" +
        "GROUP BY item.Title;",
        function(err, rows, fields) {
            if (err) {
                console.log("an error occured whilst trying to get all the items with a longer then average completion" +
                    "time in the list Shared");
                res.writeHead(422);
                res.end("true");
            } else {
                numToDosLongComplete = rows;
            }
        }
    );

    connection.query(
        "select distinct list.Name, avg(DATEDIFF(item.CompletionDate, item.CreationDate)) as Average_Completion_Time " +
        "from ToDoList list, ToDoItem item " +
        "WHERE item.ToDoListId = list.Id " +
        "AND item.CompletionDate > item.CreationDate  " +
        "AND list.name like \"Shared\";",
        function(err, rows, fields) {
            if (err) {
                console.log("an error occurred whilst trying to get the average completion time of the \"Shared\"" +
                    "ToDoList");
                res.writeHead(422);
                res.end("true");
            } else {
                averageCompletionTime = rows;
            }
        }
    );

    connection.query(
        "Select DISTINCT list.* "+
        "FROM ToDoList list,  Tag tag, ItemTag iTag, ToDoItem item"+
        "WHERE tag.Id = iTag.TagId " +
            "AND item.Id = iTag.ToDoId " +
            "AND list.Id = item.ToDoListId " +
            "AND tag.Id = 5;",
    function(err, rows, fields) {
        if (err) {
            console.log("an error occured whilst trying to get all the lists with items with tag id 5");
            res.writeHead(422);
            res.end("true");
        } else {
            listsWithTag = rows;
        }
    });

    var responseBody = {
        todos_per_tag: numToDosPerTag,
        long_complete_todos: numToDosLongComplete,
        average_compltionTime: averageCompletionTime,
        listsWithTag: listsWithTag
    };

    res.json(responseBody);
    res.end();
});

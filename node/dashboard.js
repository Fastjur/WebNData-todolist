/**
 * Created by fastjur on 14-1-16.
 */

var db = require("./mysqlconn.js");
var url = require("url");

var numToDosPerTag, numToDosLongComplete, averageCompletionTime, listsWithTag;

var getDashboardInfo = function(req, res) {
    db.connection.query(
        "SELECT tag.text, COUNT(item.Completed) " +
        "FROM ToDoItem item, ItemTag iTag, Tag tag " +
        "WHERE iTag.ToDoId = item.Id " +
        "AND iTag.TagId = tag.Id " +
        "GROUP BY tag.text;"
        , function(err, rows, fields) {
            if (err){
                console.log("error trying to get pending todos per Tag", err);
                res.writeHeader(442);
                res.end(err);
            } else {
                numToDosPerTag = rows;
            }
        }
    );

    db.connection.query(
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
        function(err, rows) {
            if (err) {
                console.log("an error occured whilst trying to get all the items with a longer then average completion" +
                    "time in the list Shared", err);
                res.writeHead(422);
                res.end("true");
            } else {
                numToDosLongComplete = rows;
            }
        }
    );

    db.connection.query(
        "select distinct list.Name, avg(DATEDIFF(item.CompletionDate, item.CreationDate)) as Average_Completion_Time " +
        "from ToDoList list, ToDoItem item " +
        "WHERE item.ToDoListId = list.Id " +
        "AND item.CompletionDate > item.CreationDate  " +
        "AND list.name like \"Shared\";",
        function(err, rows) {
            if (err) {
                console.log("an error occurred whilst trying to get the average completion time of the \"Shared\"" +
                    "ToDoList", err);
                res.writeHead(422);
                res.end("true");
            } else {
                averageCompletionTime = rows;
            }
        }
    );

    db.connection.query(
        "Select DISTINCT list.* "+
        "FROM ToDoList list,  Tag tag, ItemTag iTag, ToDoItem item"+
        "WHERE tag.Id = iTag.TagId " +
        "AND item.Id = iTag.ToDoId " +
        "AND list.Id = item.ToDoListId " +
        "AND tag.Id = 5;",
        function(err, rows) {
            if (err) {
                console.log("an error occured whilst trying to get all the lists with items with tag id 5", err);
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
};

module.exports.getDashboardInfo = getDashboardInfo;
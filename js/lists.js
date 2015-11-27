/**
 * Created by Jurriaan on 19-11-2015.
 */
window.addEventListener("load", function() {
    console.log("lists.js loaded");
    document.getElementById("logoutBtn").addEventListener("click", function(event) {
        event.preventDefault();
        //TODO: destroy session and notify user of logout...
        window.location.href = "index.html";
    });
    document.getElementById("addList").addEventListener("click", function(event) {
        showAddList(event);
    });
    document.getElementById("addListBtn").addEventListener("click", function(event) {
        addList(event);
    });
    document.getElementById("cancelAddListBtn").addEventListener("click", function(event) {
        event.preventDefault();

        document.getElementById("addListName").value = "";
        $(".popupBg").hide();
        $(".popupContent").hide();
    });
    document.getElementById("addTodoBtn").addEventListener("click", function(event) {
        event.preventDefault();
        window.todos.add("",0);
    });
    document.getElementById("sort_todos").addEventListener("click", function() {
        var sortBy = document.getElementById("sort_type").value,
            sortOrder = document.getElementById("sort_order").value;
        console.log(sortBy, sortOrder);
        if (sortBy == "Priority") {
            window.todos.array.sort(function(a, b) {
                if (sortOrder == "Descending") {
                    return b.priority - a.priority;
                } else if (sortOrder == "Ascending") {
                    return a.priority - b.priority;
                }
            });
        }
        window.todos.draw();
    });
    window.initialDraw = false;//Prevents the list from being redrawn for every item it gets initially
    getTodoItems();
    window.initialDraw = true;
    addDeleteEvents();
});

var updateTodo = function () {
    var text = this.value,
        id = this.parentElement.dataset.id;
    window.todos.editTodo(id, text);
};

var updateTodoPriority = function () {

};

var deleteList = function (event) {
    event.preventDefault();
    var name = this.parentElement.lastElementChild.innerText;
    if(confirm("Are you certain you want to delete the list \"" + name + "\"")) {
        this.parentElement.remove();
    }
};

function addDeleteEvents() {
    var deleteBtns = document.getElementsByClassName("deleteListBtn");

    for(var i=0; i<deleteBtns.length; i++) {
        deleteBtns[i].children[0].addEventListener("click", deleteList, false);
    }
}

function showAddList(event) {
    event.preventDefault();

    document.getElementById("addListName").value = "";
    $(".popupBg").show();
    $(".popupContent").hide(); //Hides all other popups except addList
    $("#addListPopup").show();
}

function addList(event) {
    event.preventDefault();

    var list = document.getElementById("lists"),
        name = document.getElementById("addListName").value,
        child = document.createElement("li"),
        button = document.createElement("button"),
        span = document.createElement("span");
    child.className = "listName deleteListBtn";
    button.className = "button red";
    button.appendChild(document.createTextNode("X"));
    child.appendChild(button);
    span.appendChild(document.createTextNode(name));
    child.appendChild(span);

    button.addEventListener("click", deleteList, false);

    list.appendChild(child);

    $(".popupBg").hide();
    $(".popupContent").hide();

}

function Todo (text, priority) {
    this.text = text;
    this.priority = priority;
}

Todo.prototype = {
    toString: function() {
        return "Todo: " + this.text + ", priority: " + this.priority;
    }
};

function todoArray () {
    this.array = [];
}

todoArray.prototype = {
    add: function(text, priority) {
        var todo = new Todo(text, priority);
        this.array.push(todo);
        if(window.initialDraw) {
            window.todos.draw();
        }
    },
    delete: function(id) {
        this.array.splice(id, 1);
        window.todos.draw();
    },
    editTodo: function(id, text, priority) {
        this.array[id].text = text;
        if(priority != null) {
            this.array[id].priority = priority;
        }
    },
    draw: function() {
        var listEntries = document.getElementsByClassName("listEntries")[0];
        listEntries.innerHTML = "";
        for(var i=0; i<this.array.length; i++) {
            var li = document.createElement("li"),
                priority = this.array[i].priority;
            li.className = "todo " + priority;
            li.deleted = false;
            li.dataset.id = i;
            li.dataset.priority = this.array[i].priority;

            var btn = document.createElement("button"),
                btnText = document.createTextNode("Delete");
            btn.addEventListener("click", function () {
                id = this.parentElement.dataset.id;
                window.todos.delete(id);
            });
            btn.className = "btnDelete";

            var priority = document.createElement("select"),
                note = document.createElement("option"),
                deadline = document.createElement("option"),
                medium = document.createElement("option"),
                important = document.createElement("option"),
                noteText = document.createTextNode("Note"),
                deadlineText = document.createTextNode("Deadline"),
                mediumText = document.createTextNode("Medium"),
                importantText = document.createTextNode("Important");
            note.value = 0;
            deadline.value = 1;
            medium.value = 2;
            important.value = 3;
            note.appendChild(noteText);
            deadline.appendChild(deadlineText);
            medium.appendChild(mediumText);
            important.appendChild(importantText);

            if(this.array[i].priority == 1) {
                deadline.selected = true;
            } else if(this.array[i].priority == 2) {
                medium.selected = true;
            } else if (this.array[i].priority == 3) {
                important.selected = true;
            }

            priority.appendChild(note);
            priority.appendChild(deadline);
            priority.appendChild(medium);
            priority.appendChild(important);

            btn.appendChild(btnText);
            li.appendChild(btn);
            li.appendChild(priority);


            var input = document.createElement("input"),
                inputText = this.array[i].text;
            input.type = "text";
            input.value = inputText;
            input.className = "todoValue";
            input.addEventListener("keyup", updateTodo, false);
            li.appendChild(input);

            listEntries.appendChild(li);
        }

        if(this.array.length == 0) {
            listEntries.innerHTML = "<span class=\"error\">No data found in array!</span>";
        }
    }
};


function getTodoItems() {
    //TODO, database connection to get actual items
    window.todos = new todoArray();
    window.todos.add("Note thing", 0);
    window.todos.add("Deadline thing", 1);
    window.todos.add("Medium thing", 2);
    window.todos.add("Important thing", 3);

    window.todos.draw();
}

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
        addTodo(0);
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

function addTodo(id) {
    //noinspection LoopStatementThatDoesntLoopJS
    for(var i=0; i < window.todos.array.length; i++) {
        var found = window.todos.array.some(function (el) {
            return el.id === id;
        });
        if(!found) {
            var todo = new Todo(id, "", 0);
            window.todos.array.push(todo);
            window.todos.draw();
            break;
        } else {
            addTodo(id + 1);
            break;
        }
    }
}

function updateTodoPriority(me) {
    window._TEMP = me;
    var priority = me.options[me.selectedIndex].value,
        todo = window.todos.array[me.parentElement.dataset.id];
    console.log(todo);
}

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

function Todo (id, text, priority) {
    this.id = id;
    this.text = text;
    this.priority = priority;
}

Todo.prototype = {
    toString: function() {
        return "Todo: " + this.id + ", text: " + this.text + ", priority: " + this.priority;
    }
};

function TodoArray () {
    this.array = [];
}

TodoArray.prototype = {
    add: function(id, text, priority) {
        var todo = new Todo(id, text, priority);
        this.array.push(todo);
        if(window.initialDraw) {
            window.todos.draw();
        }
    },
    delete: function(id) {
        console.log("Delete" + id);
        for(var i=0; i < window.todos.array.length; i++) {
            console.log(window.todos.array[i]);
            if(window.todos.array[i].id == id) {
                window.todos.array.splice(i, 1);
            }
        }
        window.todos.draw();
    },
    editTodo: function(id, text, priority) {
        console.log("Edit" + id);
        for(var i=0; i < window.todos.array.length; i++) {
            if(window.todos.array[i].id == id) {
                window.todos.array[1].text = text;
                if(priority !== undefined) {
                    window.todos.array[i].priority = priority;
                }
            }
        }
        console.log(window.todos.array);
    },
    draw: function() {
        var listEntries = document.getElementsByClassName("listEntries")[0];
        listEntries.innerHTML = "";
        for(var i=0; i<this.array.length; i++) {
            var li = document.createElement("li"),
                priorityItem = this.array[i].priority;
            li.className = "todo priority_" + priorityItem;
            li.deleted = false;
            li.dataset.id = this.array[i].id;
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
                low = document.createElement("option"),
                medium = document.createElement("option"),
                high = document.createElement("option"),
                noteText = document.createTextNode("Note"),
                lowText = document.createTextNode("Low"),
                mediumText = document.createTextNode("Medium"),
                highText = document.createTextNode("High");
            note.value = 0;
            low.value = 1;
            medium.value = 2;
            high.value = 3;
            note.appendChild(noteText);
            low.appendChild(lowText);
            medium.appendChild(mediumText);
            high.appendChild(highText);

            if(this.array[i].priority == 1) {
                low.selected = true;
            } else if(this.array[i].priority == 2) {
                medium.selected = true;
            } else if (this.array[i].priority == 3) {
                high.selected = true;
            }

            priority.addEventListener("change", function() {
                updateTodoPriority(this);
            });

            priority.appendChild(note);
            priority.appendChild(low);
            priority.appendChild(medium);
            priority.appendChild(high);

            btn.appendChild(btnText);

            var input = document.createElement("input"),
                inputText = this.array[i].text;
            input.type = "text";
            input.value = inputText;
            input.className = "todoValue";
            input.addEventListener("keyup", updateTodo, false);

            li.appendChild(btn);
            li.appendChild(input);
            li.appendChild(priority);

            listEntries.appendChild(li);
        }

        if(this.array.length == 0) {
            listEntries.innerHTML = "<span class=\"error\">No data found in array!</span>";
        }
    }
};


function getTodoItems() {
    //TODO, database connection to get actual items
    window.todos = new TodoArray();
    window.todos.add(5, "Note thing", 0);
    window.todos.add(6, "Low thing", 1);
    window.todos.add(7, "Medium thing", 2);
    window.todos.add(8, "High thing", 3);

    window.todos.draw();
}

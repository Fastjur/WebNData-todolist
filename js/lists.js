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
        window.todos.add("","note");
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

function Todo (text, type) {
    this.text = text;
    this.type = type;
}

Todo.prototype = {
    toString: function() {
        return "Todo: " + this.text + ", type: " + this.type;
    }
};

function todoArray () {
    this.array = [];
}

todoArray.prototype = {
    add: function(text, type) {
        var todo = new Todo(text, type);
        this.array.push(todo);
        if(window.initialDraw) {
            window.todos.draw();
        }
    },
    delete: function(id) {
        this.array.splice(id, 1);
        window.todos.draw();
    },
    editTodo: function(id, text, type) {
        this.array[id].text = text;
        if(type != null) {
            this.array[id].type = type;
        }
        console.clear();
        for (var i=0; i<this.array.length; i++) {//TODO remove debugging in console
            console.log(this.array[i]);
        }
    },
    draw: function() {
        var listEntries = document.getElementsByClassName("listEntries")[0];
        listEntries.innerHTML = "";
        console.clear();
        for(var i=0; i<this.array.length; i++) {
            console.log(this.array[i]);
            var li = document.createElement("li"),
                type = this.array[i].type;
            li.className = "todo " + type;
            li.deleted = false;
            li.dataset.id = i;
            li.dataset.type = this.array[i].type;

            var btn = document.createElement("button"),
                btnText = document.createTextNode("Delete");
            btn.addEventListener("click", function () {
                id = this.parentElement.dataset.id;
                window.todos.delete(id);
            });
            btn.className = "btnDelete";
            btn.appendChild(btnText);
            li.appendChild(btn);

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
}


function getTodoItems() {
    //TODO, database connection to get actual items
    window.todos = new todoArray();
    window.todos.add("One", "note");
    window.todos.add("Two", "important");
    window.todos.add("Three", "deadline");

    window.todos.draw();

    /*var listEntries = document.getElementsByClassName("listEntries")[0];

    for(var i=0; i<todoArray.length; i++) {
        var li = document.createElement("li"),
            type = todoArray[i].type;
        li.className = "todo " + type;
        li.deleted = false;
        li.dataset.id = todoArray

        var btn = document.createElement("button"),
            btnText = document.createTextNode("Delete");
        btn.addEventListener("click", function () {
            id = 1;
            var todo = window.todoArray[id];
            todo.delete();
        });
        btn.className = "btnDelete";
        btn.appendChild(btnText);
        li.appendChild(btn);

        var input = document.createElement("input"),
            inputText = todoArray[i].text;
        input.type = "text";
        input.value = inputText;
        li.appendChild(input);

        listEntries.appendChild(li);
    }*/
}

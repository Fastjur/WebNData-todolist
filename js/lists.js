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
    addDeleteEvents();
    getTodoItems();
});

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

function Todo (id, text, type) {
    this.id = id;
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
        var todo = new Todo(this.array.length, text, type);
        this.array.add(todo);
    },
    delete: function(id) {
        this.array.splice(id, 1);
    },
    draw: function() {
        var listEntries = document.getElementsByClassName("listEntries")[0];
        listEntries.innerHTML = "";

        for(var i=0; i<this.array.length; i++) {
            var li = document.createElement("li"),
                type = this.array[i].type;
            li.className = "todo " + type;
            li.deleted = false;
            li.dataset.id = this.array[i].id;

            var btn = document.createElement("button"),
                btnText = document.createTextNode("Delete");
            btn.addEventListener("click", function () {
                id = this.array[i].id;
                todoArray.delete(id);
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
        }
    }
}


function getTodoItems() {
    //TODO, database connection to get actual items
    window.todoarray = new todoArray();
    window.todoarray.add("Note 1", "note");
    window.todoarray.add("Important 2", "important");
    window.todoarray.add("Deadline 3", "deadline");

    var listEntries = document.getElementsByClassName("listEntries")[0];

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
    }
}

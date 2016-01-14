/**
 * Created by Jurriaan on 19-11-2015.
 *
 */
var updateDbTimeout,
    titleSizeCookie = Cookies.get('titlesize');
if (titleSizeCookie === undefined) {
    titleSize = 20;
    Cookies.set('titlesize', 20);
} else {
    titleSize = titleSizeCookie;
}
window.addEventListener("load", function() {
    console.log("lists.js loaded");
    document.getElementById("logoutBtn").addEventListener("click", function(event) {
        event.preventDefault();
        //TODO: destroy session and notify user of logout...
        window.location.href = "index.html";
    });
    document.getElementById("addTodoBtn").addEventListener("click", function(event) {
        event.preventDefault();
        window.initialDraw = false;
        addTodo();
        getTodoItems();
        window.todos.draw();
        window.initialDraw = true;
    });
    window.todos = new TodoArray();
    document.getElementById("sort_todos").addEventListener("click", sortTodos);
    document.getElementsByClassName('fontSizeContainer')[0].addEventListener("click", updateTitleSize);
    window.initialDraw = false;//Prevents the list from being redrawn for every item it gets initially
    getTodoItems();
    window.initialDraw = true;
    addDeleteEvents();

    updateDbTimeout = window.setInterval(function() {window.todos.updateDatabase()}, 5000);
});

var updateTitleSize = function(el) {
    var val = el.target.dataset.val;
    switch (val) {
        case ("1"):
            console.log(titleSize);
            if (titleSize < 35) {
                titleSize++;
            }
            break;
        case ("-1"):
            if (titleSize > 12) {
                titleSize--;
            }
            break
    }
    Cookies.set('titlesize', titleSize);
    $(".todoTitle").each(function() {
        this.style.fontSize = titleSize + "px";
    });
};

var sortTodos = function() {
    var sortBy = document.getElementById("sort_type").value,
        sortOrder = document.getElementById("sort_order").value;
    if (sortBy == "Priority") {
        window.todos.array.sort(function(a, b) {
            if (sortOrder == "Descending") {
                Cookies.set('sorting', {
                    by: 'Priority',
                    order: 'Descending'
                });
                return b.priority - a.priority;
            } else if (sortOrder == "Ascending") {
                Cookies.set('sorting', {
                    by: 'Priority',
                    order: 'Ascending'
                });
                return a.priority - b.priority;
            }
        });
    } else if (sortBy == "Duedate") {
        window.todos.array.sort(function(a, b) {
            if (sortOrder == "Descending") {
                Cookies.set('sorting', {
                    by: 'Duedate',
                    order: 'Descending'
                });
                return b.duedate - a.duedate;
            } else if (sortOrder == "Ascending") {
                Cookies.set('sorting', {
                    by: 'Duedate',
                    order: 'Ascending'
                });
                return a.duedate - b.duedate;
            }
        });
    }
    window.todos.draw();
};

var updateTodo = function (me) {
    var text = me.value,
        id = me.parentElement.dataset.id;
    for (var i=0; i<todos.array.length; i++) {
        if(todos.array[i].id == id) {
            window.todos.array[i].text = text;
            break;
        }
    }
};

var updateTodoTitle = function (me) {
    var title = me.value,
        id = me.parentElement.dataset.id;
    for (var i=0; i<todos.array.length; i++) {
        if(todos.array[i].id == id) {
            window.todos.array[i].title = title;
            break;
        }
    }
};

function addTodo() {
    var now = formatDate(new Date());
    $.ajax({
        url: "http://localhost:3030/addtodo",
        method: "GET",
        data: {
            title: "New Note",
            text: "",
            duedate: now,
            done: 0,
            priority: 0
        }
    })
    .done(function(data) {
        if(data == "false") {
            console.error("addTodo error!", data);
        }
        window.todos.draw();
    })
    .fail(function(data) {
        console.error("addTodo error!", data);
    })
}

function updateTodoPriority(me) {
    var priority = me.options[me.selectedIndex].value,
        id = me.parentElement.dataset.id;
    for (var i=0; i<todos.array.length; i++) {
        if(todos.array[i].id == id) {
            window.todos.array[i].priority = priority;
            break;
        }
    }
}

function updateTodoDueDate(me) {
    var duedate = me.valueAsNumber/1000,
        id = me.parentElement.dataset.id;
    for (var i=0; i<todos.array.length; i++) {
        if(todos.array[i].id == id) {
            window.todos.array[i].duedate = duedate;
            break;
        }
    }
    window.todos.draw();
}

function updateTodoDone(me) {
    var done = me.checked,
        id = me.parentElement.dataset.id;
    for (var i=0; i<todos.array.length; i++) {
        if(todos.array[i].id == id) {
            window.todos.array[i].done = done;
            break;
        }
    }
    window.todos.draw();
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
        deleteBtns[i].addEventListener("click", deleteList, false);
    }
}

function Todo (id, title, text, priority, duedate, done) {
    this.id = id;
    this.title = title;
    this.text = text;
    this.priority = priority;
    this.duedate = duedate;
    this.done = done;
}

Todo.prototype = {
    toString: function() {
        return "Todo: " + this.id + ", text: " + this.text + ", priority: " + this.priority + ", duedate: " +
            this.duedate + ", done: " + this.done;
    }
};

function TodoArray () {
    this.array = [];
}

TodoArray.prototype = {
    add: function(id, title, text, priority, duedate, done) {
        var todo = new Todo(id, title, text, priority, duedate, done);
        this.array.push(todo);
        if(window.initialDraw) {
            window.todos.draw();
        }
    },
    delete: function(id) {
        $.ajax({
            url: "http://localhost:3030/removetodo",
            method: "GET",
            data: {
                id: id
            }
        })
        .done(function(){
            getTodoItems();
            window.todos.draw();
        });
    },
    updateDatabase: function() {
        for (var i in this.array) {

            var title = window.todos.array[i].title,
            text = window.todos.array[i].text,
            duedate = formatDate(new Date(window.todos.array[i].duedate*1000)),
            done = window.todos.array[i].done,
            priority = window.todos.array[i].priority,
            id = window.todos.array[i].id;

            $.ajax({
                url: "http://localhost:3030/updatetodo",
                method: "GET",
                data: {
                    title: title,
                    text: text,
                    duedate: duedate,
                    done: done ? 1 : 0,
                    priority: priority,
                    id: id
                },
                processData: true,
                contentType: false
            })
        }
    },
    draw: function() {
        var listEntries = document.getElementsByClassName("listEntries")[0],
            now = new Date().getTime();
        listEntries.innerHTML = "";
        for(var i=0; i<this.array.length; i++) {
            var li = document.createElement("li"),
                priorityItem = this.array[i].priority;
            li.className = "todo priority_" + priorityItem;
            if (this.array[i].done) {
                li.className += " done";
            } else if (this.array[i].duedate*1000 < now) {
                li.className += " overdue";
            }
            li.deleted = false;
            li.dataset.id = this.array[i].id;
            li.dataset.priority = this.array[i].priority;
            li.dataset.done = this.array[i].done;

            var title = document.createElement("input");
            title.type = "text";
            title.value = this.array[i].title;
            title.className = "todoTitle";
            title.style.fontSize = titleSize + "px";
            title.addEventListener("change", function() {
                updateTodoTitle(this);
            });

            var btn = document.createElement("i"),
                btnText = document.createTextNode("delete");
            btn.addEventListener("click", function () {
                var id = this.parentElement.dataset.id;
                window.todos.delete(id);
            });
            btn.className = "btnDelete material-icons";

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

            var input = document.createElement("textarea"),
                inputText = this.array[i].text;
            input.type = "text";
            input.value = inputText;
            input.className = "todoValue";
            input.addEventListener("change", function() {
                updateTodo(this);
            });

            var duedate = document.createElement("input");
            duedate.type = "date";
            duedate.valueAsNumber = this.array[i].duedate*1000;
            duedate.addEventListener("change", function() {
                updateTodoDueDate(this);
            });

            var done = document.createElement("input"),
                doneText = document.createTextNode("Done");
            done.type = "checkbox";
            done.className = "donecheck";
            done.appendChild(doneText);
            done.addEventListener("change", function() {
                updateTodoDone(this);
            });

            if(this.array[i].done) {
                title.disabled = "disabled";
                input.disabled = "disabled";
                duedate.disabled = "disabled";
                priority.disabled = "disabled";
                done.checked = true;
            } else {
                done.checked = false;
            }

            li.appendChild(title);
            li.appendChild(btn);
            li.appendChild(input);
            li.appendChild(priority);
            li.appendChild(duedate);
            li.appendChild(done);

            listEntries.appendChild(li);
        }

        if(this.array.length == 0) {
            listEntries.innerHTML = "<span class=\"error\">No data found in array!</span>";
        }
    },
    equals: function(that) {
        if (!(that instanceof TodoArray)) {
            return false;
        }
        for (var i in this.array) {


            var title = window.todos.array[i].title,
                text = window.todos.array[i].text,
                duedate = formatDate(new Date(window.todos.array[i].duedate * 1000)),
                done = window.todos.array[i].done,
                priority = window.todos.array[i].priority,
                id = window.todos.array[i].id;
            //TODO
        }
    }
};

function getTodoItems() {
    window.todos = new TodoArray();
    $.ajax({
       url: "http://localhost:3030/alltodos",
        method: "GET"
    })
    .done(function(data) {
        data.forEach(function (el) {
            window.todos.add(el.id, el.title, el.text, el.priority, el.duedate, el.done);
        });
        var sort = Cookies.getJSON('sorting');
        if (sort !== undefined) {
            document.getElementById("sort_type").value = sort.by;
            document.getElementById("sort_order").value = sort.order;
            sortTodos();
        }
    })
}

function formatDate(date) {
    return date.getFullYear() + "-" +
           ("0" + (date.getMonth()+1)).slice(-2) + "-" +
           ("0" + date.getDate()).slice(-2) + " " +
           ("0" + date.getHours()).slice(-2) + ":" +
           ("0" + date.getMinutes()).slice(-2) + ":" +
           ("0" + date.getSeconds()).slice(-2);
}
window.addEventListener("load", function () {
    console.log("sup");
   document.getElementById("btnRefresh").addEventListener("click", function () {
       event.preventDefault();
       window.stats.updateStats();
   });
    window.stats = new ServerStats();
    window.stats.setStats("loading");
    window.stats.updateStats();
});

function ServerStats() {
    this.array = {}
}

ServerStats.prototype = {
    displayStats: function (data) {
        console.log(data);

        var numTodosPerTagTable = document.createElement("table"),
            numTodosThead = document.createElement("thead"),
            numTodosTr = document.createElement("tr"),
            numTodoText = document.createElement("th"),
            numTodoCount = document.createElement("th");
        numTodoText.innerHTML = "text";
        numTodoCount.innerHTML = "count";
        numTodoCount.rowSpan = "2";
        numTodosTr.appendChild(numTodoText);
        numTodosTr.appendChild(numTodoCount);
        numTodosThead.appendChild(numTodosTr);
        numTodosPerTagTable.appendChild(numTodosThead);

        var numTodoPerTagBody = document.createElement("tbody");

        for (var i=0; i<data.todos_per_tag.length; i++) {
            var numToDoTagData = data.todos_per_tag[i];

            var numToDosTr = document.createElement("tr");

            var tagTextTd = document.createElement("td");
            tagTextTd.innerHTML = numToDoTagData.text;

            var tagCountTd = document.createElement("td");
            tagCountTd.innerHTML = numToDoTagData.num;

            numToDosTr.appendChild(tagTextTd);
            numToDosTr.appendChild(tagCountTd);

            numTodoPerTagBody.appendChild(numToDosTr);
        }
        numTodosPerTagTable.appendChild(numTodoPerTagBody);

        document.getElementById("numToDosPerTag").innerHTML = "";
        document.getElementById("numToDosPerTag").appendChild(numTodosPerTagTable);

        var avgTimesPerTagTable = document.createElement("table"),
            avgTimesThead = document.createElement("thead"),
            avgTimesTr = document.createElement("tr"),
            avgTimeText = document.createElement("th"),
            avgTimeCount = document.createElement("th");
        avgTimeText.innerHTML = "name";
        avgTimeCount.innerHTML = "title";
        avgTimeCount.rowSpan = "2";
        avgTimesTr.appendChild(avgTimeText);
        avgTimesTr.appendChild(avgTimeCount);
        avgTimesThead.appendChild(avgTimesTr);
        avgTimesPerTagTable.appendChild(avgTimesThead);

        var avgTimePerTagBody = document.createElement("tbody");

        for (var i1=0; i1<data.long_complete_todos.length; i1++) {
            var AvgTimetagData = data.long_complete_todos[i1];

            var AvrTimeToDosTr = document.createElement("tr");

            var listNameTd = document.createElement("td");
            listNameTd.innerHTML = AvgTimetagData.name;

            var listTitleTd = document.createElement("td");
            listTitleTd.innerHTML = AvgTimetagData.Title;

            AvrTimeToDosTr.appendChild(listNameTd);
            AvrTimeToDosTr.appendChild(listTitleTd);

            avgTimePerTagBody.appendChild(AvrTimeToDosTr);
        }
        avgTimesPerTagTable.appendChild(avgTimePerTagBody);

        document.getElementById("numToDosLongComplete").innerHTML = "";
        document.getElementById("numToDosLongComplete").appendChild(avgTimesPerTagTable);
    },

    updateStats: function() {
        console.log("recieved serverstats");

        $.ajax({
            url: "http://localhost:3030/dashboard",
            method: "GET"
        }).done(function(data) {
            window.stats.displayStats(data);
        })
    },

    setStats: function(text) {
        for (var i = 0; i<document.getElementsByClassName("stat").length; i++){
            document.getElementsByClassName("stat")[i].innerHTML = text;
        }
    }
};
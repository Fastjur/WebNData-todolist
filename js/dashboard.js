window.addEventListener("load", function () {
    console.log("sup");
   document.getElementById("btnRefresh").addEventListener("click", function () {
       event.preventDefault();
       window.stats.updateStats();
   });
    window.stats = new ServerStats();
    window.stats.setStats("loading");
});

function ServerStats() {
    this.array = {}
}

ServerStats.prototype = {
    updateStats: function() {
        console.log("recieved serverstats");

        $.ajax({
            url: "http://localhost:3030/dashboard",
            method: "GET"
        }).done(function(data) {
            this.displayStats(data)
        })
    },

    displayStats: function (data) {
        console.log(data);
        
        document.getElementById("numToDosPerTag").innerHTML = data.todos_per_tag;
        document.getElementById("numToDosLongComplete").innerHTML = data.long_complete_todos;
        document.getElementById("averageCompletionTime").innerHTML = data.average_compltionTime;
        document.getElementById("listsWithTag").innerHTML = data.listsWithTag;
    },

    setStats: function(text) {
        for (var i = 0; i<document.getElementsByClassName("stat").length; i++){
            document.getElementsByClassName("stat")[i].innerHTML = text;
        }
    }
};
/**
 * Created by Jurriaan on 19-11-2015.
 */
window.addEventListener("load", function() {
    console.log("main.js loaded!");
    document.getElementById("btnLogin").addEventListener("click", function (event) {
        event.preventDefault();
        window.location.href = "login.html";
    });
    document.getElementById("btnJoin").addEventListener("click", function (event) {
        event.preventDefault();
        window.location.href = "join.html";
    });
});

/**
 * Created by Jurriaan on 19-11-2015.
 */
window.addEventListener("load", function () {
    console.log("join.js loaded");
    document.getElementById("joinBtn").addEventListener("click", function(event) {
        event.preventDefault();
        //TODO: actually register...
        window.location.href = "lists.html";
    });
});
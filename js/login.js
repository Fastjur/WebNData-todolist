/**
 * Created by Jurriaan on 19-11-2015.
 */
window.addEventListener("load", function() {
    console.log("login.js loaded");
    document.getElementById("loginBtn").addEventListener("click", function(event) {
        event.preventDefault();
        //TODO: actually check login...
        window.location.href = "lists.html";
    });
});
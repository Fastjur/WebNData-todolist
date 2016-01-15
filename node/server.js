/**
 * Created by Jurriaan on 4-12-2015.
 * Server node file
 */

/* global __dirname */

var d = new Date();
var t = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
console.log("Server started\n" + t);

var express = require('express'),
    app = express(),
    http = require('http'),
    url = require('url'),
    bodyParser = require('body-parser'),
    db = require('./todos.js'),
    dashboard = require('./dashboard.js'),
    credentials = require('./credentials.js'),
    passport = require('passport'),
    TwitterStrategy = require('passport-twitter').Strategy,
    cookies = require('cookie-parser'),
    sessions = require('express-session');

app.use(cookies(credentials.cookieSecret));
app.use(sessions(credentials.cookieSecret));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new TwitterStrategy(credentials.twitter, function(token, tokenSecret, profile, done) {
    console.log(token, tokenSecret, profile, done);
    done(null, {message: "Twitter user signed in!"} );
}));

app.use(bodyParser.json());
app.use(express.static(__dirname + "/../"));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

http.createServer(app).listen(3030);
console.log("Listening on port 3030");

app.get("/l+i+s+t+s+", function(reg, res) {
    console.log("Received /lists");
    db.getLists(res);
});

app.get("/a+l+t+o+d+o+s+", function (req, res) {
    console.log("Received /alltodos");
    db.getAllTodos(res);
});

app.get("/a+d+t+o+d+o+", function(req, res) {
    console.log("Received /addtodo");
    db.addTodo(req, res);
});

app.get("/r+e+m+o+v+e+t+o+d+o+", function(req, res) {
    console.log("Received /removetodo");
    db.removeTodo(req, res);
});

app.get("/d+a+s+h+b+o+a+r+d+", function(req, res) {
    console.log("Recieved /dashboard");
    dashboard.getDashboardInfo(req, res);
});

app.get("/u+p+d+a+t+e+t+o+d+o+", function(req, res) {
    console.log("Received /updatetodo");
    db.updateTodo(req, res);
});

// Redirect the user to Twitter for authentication.
app.get('/auth/twitter', passport.authenticate('twitter'));

// Twitter will redirect the user to this URL after approval.
app.get('/test-login',
    passport.authenticate('twitter', { failureRedirect: '/failure' }),
    function(req, res) {
res.redirect('/success');
});
app.get("/success", function (req, res) {
    console.log("Success!");
    res.redirect("/lists");
});
app.get("/failure", function (req, res) {
    console.log("Failure!");
    res.send("User login via Twitter failed!");
});
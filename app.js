var express = require('express');
var app = express();
var upload = require('express-fileupload');
var path = require('path');
var index = require('./routes/index');

// Server Listening On Port 3000
app.listen(2000);

// Sets The View Engine
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

app.use(upload());
app.use(express.static(__dirname + '/public'));
app.use("/", index);

module.exports = app;
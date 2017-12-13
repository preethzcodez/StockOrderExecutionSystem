var express = require('express');
var app = express();
var upload = require("express-fileupload");

// Server Listening On Port 3000
app.listen(3000);

// Use Upload Middleware
app.use(upload());

// Get Request
app.get("/",function(req, res) {
    res.sendFile(__dirname+"/public/index.html");
});

// Post Request
app.post("/",function(req, res) {
    if(!req.files)
        res.status(400).send("No Files Uploaded");
    else {
        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  var sampleFile = req.files.soes;
  
    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(__dirname+"/upload.csv", function(err) {
      if (err)
        return res.status(500).send(err);
  
      res.send('File uploaded!');
    });
    }
});
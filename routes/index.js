var router = require('express').Router();
var processOrder = require('../controller/parse_csv.js');

router.get("/", function (req, res) {
    res.render("index");
});

// Post Request
router.post("/", function (req, res) {
    if (!req.files)
        res.status(400).send("No Files Uploaded");
    else {

        var sampleFile = req.files.soes;
        // Use the mv() method to place the file somewhere on your server
        sampleFile.mv(__dirname + "/upload.csv", function (err) {
            if (err)
                return res.status(500).send(err);
            processOrder.parseCSV(__dirname + "/upload.csv");
            res.send('File uploaded!');
        });
    }
});
module.exports = router;
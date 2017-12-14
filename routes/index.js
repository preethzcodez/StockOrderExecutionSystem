var router = require('express').Router();
var processOrder = require('../controller/order_processing.js');

router.get("/", function (req, res) {
    res.render("index");
});

// Post Request
router.post("/", function (req, res) {
    var sampleFile = req.files.soes;

    // Save The File In Server
    sampleFile.mv(__dirname + "/upload.csv", function (err) {
        if (err)
            return res.status(500).send(err);
        
        // Start Processing Orders
        processOrder.parseCSV(__dirname + "/upload.csv",res);
    });
});
module.exports = router;
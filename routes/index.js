var router = require('express').Router();
var processOrder = require('../controller/order_processing.js');

router.get("/", function (req, res) {
    res.render("index");
});

// Post Request
router.post("/", function (req, res) {
    if (req.files) {
        var file = req.files.soes;

        // Save The File In Server (Folder - uploads)
        file.mv("./uploads/soes.csv", function (err) {
            if (err)
                return res.status(500).send(err);

            // Start Processing Orders
            processOrder.parseCSV("./uploads/soes.csv", res);
        });
    }
});
module.exports = router;
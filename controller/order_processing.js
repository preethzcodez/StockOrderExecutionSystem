var csv = require("fast-csv");
var fs = require("fs");
var ignoreCase = require('ignore-case');
var op = require('../engine/process_engine');
Order = require('../models/order');

module.exports = {
    /**
     * Parse CSV File And Start Order Processing
     * @param {*} file 
     */
    parseCSV: function (file, res) {
        var stream = fs.createReadStream(file);

        var orders = [];
        var csvStream = csv()
            .on("data", function (data) {

                if (!isNaN(data[3])) { // Skip The Header, If Any (Check Quantity Value Is A Number)

                    var status = "OPEN";

                    // if order quantity is zero, set status to closed
                    if (data[3] == 0) {
                        status = "CLOSED";
                    }

                    var order = new Order({ Id: data[0], Side: data[1], Company: data[2], Quantity: data[3], RemainingQuantity: data[3], Status: status });
                    orders.push(order.data); // add order into list
                }
            })
            .on("end", function () {

                // CSV Parsing Done - Start Order Processng
                var results = op.orderProcessing(orders);

                // reload page with results data 
                res.render("index", { results });
            });

        stream.pipe(csvStream);
    }
}

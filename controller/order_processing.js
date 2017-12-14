var csv = require("fast-csv");
var fs = require("fs");
var ignoreCase = require('ignore-case');
Order = require('../models/order')

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
                var status = "OPEN";

                // if order quantity is zero, set status to closed
                if (data[3] == 0) {
                    status = "CLOSED";
                }

                if (!ignoreCase.includes(data[0], "stock")) { // Skip The Header, If Any
                    var order = new Order({ Id: data[0], Side: data[1], Company: data[2], Quantity: data[3], RemainingQuantity: data[3], Status: status });
                    orders.push(order.data); // add order into list
                }
            })
            .on("end", function () {

                // CSV Parsing Done - Start Order Processng
                var results = orderProcessing(orders);

                // reload page with results data 
                console.log(results);
                res.render("index", { results });
            });

        stream.pipe(csvStream);
    }
}

/**
 * Start Processing Orders
 * @param {*} data 
 */
var orderProcessing = function (data) {
    var count = 1;
    data.forEach(order => {
        var Company = order.Company;
        var Side = order.Side;
        var temp = order.Quantity; // temporary variable 

        for (var i = count; i < data.length; i++) {

            if (data[count - 1].RemainingQuantity == 0) {
                break; // break the loop if remaining quantity is zero
            }
            else if (ignoreCase.equals(Company, data[i].Company) && (!ignoreCase.equals(Side, data[i].Side)) && data[i].RemainingQuantity > 0) {
                data[count - 1].RemainingQuantity = temp - data[i].RemainingQuantity;

                if (data[count - 1].RemainingQuantity < 0) {
                    data[i].RemainingQuantity = data[count - 1].RemainingQuantity * -1;
                    data[count - 1].RemainingQuantity = 0;
                    data[count - 1].Status = "CLOSED";
                    break; // break the loop if remaining quantity of order becomes zero
                }
                else {
                    temp = data[count - 1].RemainingQuantity;
                    data[i].RemainingQuantity = 0;
                    data[i].Status = "CLOSED";

                    if (temp == 0) {
                        data[count - 1].RemainingQuantity = 0;
                        data[count - 1].Status = "CLOSED";
                        break; // break the loop if remaining quantity of order becomes zero
                    }
                }
            }
        }
        count++;
    });
    return data;
}

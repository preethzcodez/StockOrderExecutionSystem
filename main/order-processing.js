var csv = require("fast-csv");
var fs = require("fs");
var ignoreCase = require('ignore-case');
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
                var results = orderProcessing(orders);

                // reload page with results data 
                res.render("index", { results });
            });

        stream.pipe(csvStream);
    }
}

// Order Processing Function
var orderProcessing = function (data) {
    var count = 1;
    data.forEach(order => {
        // get the company and side of each order to match with the opposite side order of same company
        var Company = order.Company;
        var Side = order.Side;

        for (var i = count; i < data.length; i++) {

            if (data[count - 1].RemainingQuantity == 0) {
                break; // break the loop if remaining quantity of the current order is already zero
            }

            // check to find the opposite side order of same company whose remaining quantity is greater than 0
            else if (ignoreCase.equals(Company, data[i].Company) && (!ignoreCase.equals(Side, data[i].Side)) && data[i].RemainingQuantity > 0) {
                
                // remaining quantity (current order) = rem quantity (current order) - rem quantity (matched order) 
                // initially we set the remaining quantity of each item as same as the quantity of that item
                data[count - 1].RemainingQuantity = data[count - 1].RemainingQuantity - data[i].RemainingQuantity;

                // check whether remaining quantity (current order) less than 0
                if (data[count - 1].RemainingQuantity < 0) {

                    // make the value positive and set it as rem quantity (matched order)
                    data[i].RemainingQuantity = data[count - 1].RemainingQuantity * -1;

                    // current order's remaining quantity becomes 0
                    data[count - 1].RemainingQuantity = 0;
                    data[count - 1].Status = "CLOSED";
                    break; // break the loop since the remaining quantity of current order becomes zero
                }
                else {
                    // matched order's remaining quantity becomes 0
                    data[i].RemainingQuantity = 0;
                    data[i].Status = "CLOSED";

                    // check whether current order remaining quantity becomes 0
                    if (data[count - 1].RemainingQuantity == 0) {
                        data[count - 1].Status = "CLOSED";
                        break; // break the loop since the remaining quantity of current order becomes zero
                    }
                }
            }
        }
        count++;
    });
    return data;
}

var ignoreCase = require('ignore-case');

module.exports = {
    /**
     * Start Processing Orders
     * @param {*} data 
     */
    orderProcessing: function (data) {
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
}
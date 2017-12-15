var ignoreCase = require('ignore-case');

module.exports = {
    /**
     * Start Processing Orders
     * @param {*} data 
     */
    orderProcessing: function (data) {
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
}
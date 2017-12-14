var csv = require("fast-csv");
var fs = require("fs");

module.exports = {
    /**
     * Parse CSV File And Return Results
     * @param {*} file 
     */
    parseCSV : function(file) {
        var stream = fs.createReadStream(file);
        
        var csvStream = csv()
            .on("data", function(data){
                 console.log(data);
            })
            .on("end", function(){
                 console.log("done");
            });
        
        stream.pipe(csvStream);
    }
}

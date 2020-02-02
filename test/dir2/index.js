var path = require("path");
var fp = path.resolve("./hello.js");

module.exports = function(){
    //var path = require("path");

    //return path.resolve("./hello.js");
    return module;
}
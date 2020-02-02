module.exports = function(){
    console.log(arguments);
    return arguments;
}

/*

var exp = require("express");
var app = exp();
app.set("view engine", "test/funcArgs.js");

app.render("index",{hello:"world"});

*/


/*

var exp = require("express");
var app = exp();
app.set("view engine", "testArgs");

app.render("index",{hello:"world"});

var exp = require("express");
var app = exp();

app.engine("njs", function(filePath, options, callback){console.log(arguments); return function(){console.log(arguments)}});
app.set("view engine", "njs");

app.render("hello", {a:"hello"}, function(){console.log(arguments)});

*/
var express = require("express");
var path = require("path");

var static = express.static("web");

var app = express();

app.engine("html", function(){
    console.log(arguments);
});
app.all("/*", (req, res, next) => {
    res.render(path.resolve("./web/test/websocket.html"));
});
//app.all("/*", static);

app.listen(80);
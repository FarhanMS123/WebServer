var path = require("path");
var fs = require("fs");
var https = require("https");

var _config = {
    passphrase: "20200413_WebServer_20200413_By_20200413_FarhanMS123_20200413",
    key: fs.readFileSync(path.join(path.dirname(module.filename), "./key.pem")),
    cert: fs.readFileSync(path.join(path.dirname(module.filename), "./cert.pem")),
    port: 443
};

module.exports = function(config, app){
    if(arguments.length == 1){
        app = config;
        config = _config;
    }

    var https_server = https.createServer(config, app);
    var https_server_listen = https_server.listen(config);
    https_server.https_server_listen = https_server_listen;

    return https_server;
}
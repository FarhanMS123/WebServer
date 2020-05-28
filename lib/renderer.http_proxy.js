// https://www.npmjs.com/package/http-proxy#options

var http_proxy = require("http-proxy");
var proxy = undefined;

module.exports = function(req,res,next){
	if(res.finished) return next();

	if(proxy == undefined) proxy = http_proxy.createProxyServer(req.app.get("config").http_proxy_opts);

	proxy.web(req,res);
}
var path = require("path");

module.exports = {
	host: "0.0.0.0",
	port: process.env.PORT || 8080,
	web_folder: path.resolve("./web"),
	tmp_folder: path.resolve("./tmp"),
	base_url: "/*", 
	http_error:{
		"404":"./web/error/404.njs"
	},
	routes:{
		"/404" : 403 //could be URL<string>, HTTP Status Codes<number>, or function(req,res,next){}
	},
	index_file: ["index.html", "default.html"],
	plugins:[
		require("./lib/localip.js"),
		require("./lib/renderer.js")
	],
	middlewares_use: [
		require("./lib/realpath.js")
	],
	middlewares_all: [
		require("./lib/reroutes.js"),
		require("./lib/DirectoryPageRenderer"),
		require("./lib/renderer.js").router
		//require("./lib/HTTPStatusHandler"), //TODO
	],
	renderer : [
		require("./lib/SimpleFileResponse")
	]
}
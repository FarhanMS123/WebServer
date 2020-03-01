var path = require("path");

module.exports = {
	host: "0.0.0.0",
	port: process.env.PORT || 8080,
	web_folder: path.resolve("./web"),
	tmp_folder: path.resolve("./tmp"),
	base_url: "/*", 
	DirectoryViewTemplate: path.resolve("./template/DirectoryView.ejs"),
	http_error:{
		"404": path.resolve("./web/error/404.njs")
	},
	routes:{
		"/404" : 404 //could be URL<string>, HTTP Status Codes<number>, or function(req,res,next){}
	},
	index_file: ["index.html", "default.html"],
	plugins:[
		require("./lib/plugin.localip.js"),
		require("./lib/router.renderer.js"),
		require("./lib/plugin.WSHandler").plugin
	],
	middlewares_use: [
		require("./lib/router.filepath.js")
	],
	middlewares_all: [
		require("./lib/router.reroutes.js"),
		require("./lib/router.renderer.js").router,
		require("./lib/router.HTTPStatusHandler.js")
	],
	renderer : [ //dir, njs, ws, ejs, simple
		require("./lib/renderer.DirectoryPageRenderer.js"),
		require("./lib/renderer.NJSHandler.js"),
		require("./lib/plugin.WShandler.js").router,
		require("./lib/renderer.EJSRenderer.js")({}),
		require("./lib/renderer.SimpleFileResponse.js")
	]
}
var config = {
	host: "0.0.0.0",
	port: process.env.PORT || 8080,
	web_folder: "./web",
	tmp_folder: "./web/tmp",
	http_error:{
		"404":"./web/error/404.njs"
	},
	routes:{
		"/web/tmp" : 403 //could be URL<string>, HTTP Status Codes<number>, or function(req,res,next){}
	},
	index_file: ["index.html", "default.html"],
	plugins:[],
	middlewares_use: [],
	middlewares_all: [
		"/*",
		require("./lib/realpath.js"),
		require("./lib/reroutes.js"),
		require("./lib/HTTPStatusHandler.js")
	]
}

module.exports = config;
var path = require("path");

module.exports = {
	host: "0.0.0.0",
	port: process.env.PORT || 8080,
	// base_url : "/*", //let this be a comment if you don't know what you did
	web_folder: path.resolve("./web"), // the root folder to being served by server.
	tmp_folder: path.resolve("./tmp"), // is used to saved junk files such as uploads, 
									   // renderer file, log file, etc. temporary
	DirectoryViewTemplate: path.resolve("./template/DirectoryView.ejs"),
	addSlashOnDirectory: true, // if true, it would redirect
							   // /dir1/dir2 -> /dir1/dir2/
							   // add more slash at the end of url
	http_error:{
		default: path.resolve("./web/error/default.ejs")
	},
	exp_static:{},
	routes:{
		// "path" : <response>
		// path represent of url in string type, could be path pattern or regex.
		// normal string      : "/dir1/dir2/index.html"
		// path pattern       : "/*/:dir1/api.njs"
		//						you could read < https://github.com/pillarjs/path-to-regexp#parameters >
		// regular expression : "^/.*/home\\.ejs(\\?.*)?$" <-- note, it should begin with "^" and end with "$"
		//
		// <response>
		// Could be string that match
		// 		URL to be redirect to a page or a web
		// 			"/dir1/dir2/index.html"
		// 			"./dir3/photos.png"
		// 			"https://www.google.com"
		//			"500 ./error/default.ejs" <-- note, it begin with 500 to set a status code
		// 		Render to a file 
		//			"FILE ./web/error/default.ejs" <-- note, it should begin with "FILE" and capitalize, 
		//											   and the "." means server directory, not web directory.
		// 		While using path pattern, you use mustache arguments to use it in response string.
		//			"/api.njs/:country/:city"	: "/api.njs?contry={{country}}&city={{city}}"
		//			"/index.njs/*"				: "FILE ./index.njs"
		//			"/*/:filename.njs/*"		: "FILE ./web/{{ 0 }}/{{ filename }}.njs" <-- if you use star(s), you could use
		//																					  number to represent the stars
		// Number as HTTP Status Codes.
		//		you could read < https://en.wikipedia.org/wiki/List_of_HTTP_status_codes >
		// Function as middlewares in express
		//		middlewares function is used to set filepath or do action for 
		//		a routes before it begin to be executed or rendered by next router.
		//		`req.filepath` is used to help renderer knows where is the true path 
		//		of file in the server to being served.
		//		you could read < https://expressjs.com/en/guide/writing-middleware.html >
		//
		//		function(req,res,next){req.filepath = ""; next();}
		//

		"/404": 404,
		"/test/api.njs/*": "FILE ./web/test/api.njs"
	},
	/**
	 * while user request a directory, server is always 
	 * giving the index file first. This features will 
	 * find the first file of the list and in an order 
	 * to next until it found the index_file that should 
	 * be shown. If it can't find any, it would render a 
	 * directory.
	 */
	index_file: ["index.html", "default.html", "index.ejs"],
	plugins:[
		require("./lib/plugin.localip.js"),
		require("./lib/router.renderer.js"),
		require("./lib/plugin.WSHandler.js").plugin
	],
	// All middlewares below is sorted in an order. Please be really carefull to edit those.
	middlewares_use: [ // here is middleware to set some options to req or res property
		require("./lib/router.test_response.js").start,
		require("./lib/router.renderer.js").router_res_renderTo
		/*                   You could place some plugins here                   */
	],
	middlewares_all: [ // here is middleware to do main process
		require("./lib/router.filepath.js"), // this should be placed first
		require("./lib/router.reroutes.js"), // this should be placed second from first
		/*                   You could place some middlewares here                   */
		require("./lib/router.renderer.js").router, //this should be placed second from last
		require("./lib/middleware.PostHandler.js").autoDelete,
		require("./lib/router.HTTPStatusHandler.js"), //this should be placed last
		require("./lib/router.test_response.js").end
	],
	renderer : [ // here is middlewares for rendering process
		require("./lib/renderer.DirectoryPageRenderer.js"), // this should be placed first
		require("./lib/renderer.NJSHandler.js"),
		require("./lib/plugin.WSHandler.js").renderer,
		/**
		 * `async` is something awful. so... if you don't know what you did, let it set to false.
		 * `handlePOST` is to use POST middlewares such as body-parser or multer.
		 */
		require("./lib/renderer.EJSRenderer.js")({async:false, handlePOST:true}),
		/*                     You could place some renderers here                     */
		require("./lib/renderer.SimpleFileResponse.js") //this should be placed last
	]
}
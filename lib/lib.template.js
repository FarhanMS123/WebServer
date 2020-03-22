/**
 * @name myModules
 * @author FarhanMS123
 * @version 1.0.0, 03/22/20
 * @usefor plugin, router, renderer, middleware
 * @requires fs, path
 * 
 * 		- module.exports.plugin(main, main_process, config); //plugin
 * 		- module.exports.router(req,res,next); //router
 * 		- module.exports.renderer(req,res,next); //router
 * 		- module.exports.middleware(req,res,next); //middleware
 * 
 * @see {@link https://jsdoc.app/ jsDoc}
 * @see {@link https://www.oracle.com/technetwork/java/javase/documentation/index-137868.html Javadoc}
 * @see {@link https://github.com/google/closure-compiler/wiki/Annotating-JavaScript-for-the-Closure-Compiler Annotating JavaScript for the Closure Compiler}
 */
module.exports = function main(){}

// Modules Required
var fs = require("fs");
var path = require("path");

module.exports.plugin = function(main, main_process, config){
	// main == global
	//...here would be the first script to be run...
	main_process.on("configurated", function(config){
		// this event would be emitted while configuration
		// in `config.js` had required to main process.
		// `config` is everything in `config.js`
	}).on("modluesImported", function(express){
		// this event would be emmitted while all modules
		// needed in required in main process.
	}).on("serverCreated", function(app){
		// https://expressjs.com/en/4x/api.html#app
		// this event would be emitted while app
		// had been inittied in main process
		// app is the express application
		app.on("serverCreated", function(app){
			// https://expressjs.com/en/4x/api.html#app
			// this event would be emitted while app
			// had been created in main process
			// app is the express application
		}).on("configSetted", function(config){
			// this event would be emitted while
			// the app has set the configuration
			// from `config` via app.set("config", config)
		}).on("settingtMiddlewares", function(app){
			// https://expressjs.com/en/4x/api.html#app.use
			// https://expressjs.com/en/4x/api.html#app.all
			// this event would be emitted before the app
			// had setted middlewares from config to router 
			// with `app.use` and `app.all`
		}).on("middlewaresSetted", function(app){
			// this event would be emitted after the app
			// had setted middlewares and ready to serve.
		}).on("appListening", function(listen){
			// https://nodejs.org/dist/latest-v12.x/docs/api/net.html#net_event_listening
			// this event would be emitted while the app
			// is listening for a new connection.
			// `listen` property is com from net socket.
		});
	});
	// All process, http, and http events still worked
	// https://nodejs.org/dist/latest-v12.x/docs/api/process.html#process_process_events
	// https://nodejs.org/dist/latest-v12.x/docs/api/http.html#http_class_http_server
	// https://nodejs.org/dist/latest-v12.x/docs/api/net.html#net_class_net_server
}

// https://expressjs.com/en/guide/writing-middleware.html
// router will be run every request.
module.exports.router = function(req,res,next){
	// Base Script
	//...here is place to build base script...
	do_next = true

	// Main Script
	//...write your main code here...
	// there are some plugins which add some property :
	//		req.filepath
	// 		req.app.get("config");
	// 		req.app.renderTo(filepath, config={})(req,res,next);
	// 		res.renderTo(filepath, config={}, callback=function(err){});
	// 	you could read another property (especially property that often 
	//  used) in references.js

	if(do_next) next(); //this would automate router
						//to execute next route.
}

//renderer will be called every rendering files
module.exports.renderer = function(req,res,next){
	// Base Script
	//...here is place to build base script...
	var do_next = true;
	//if(res.statusCode != 200){next(err); return;}
	if(res.finished){next(err); return;}

	// Main Script
	//...write your main code here...
	// there are some property that might you know :
	//		req.filepath
	//		req.renderer
	//		req.renderer_config
	// 		res.renderTo(filepath, config={}, callback=function(err){});
	var isRenderer = req.renderer ? true : false;
	var filepath = isRenderer ? req.renderer : req.filepath;
	if(!fs.existsSync(filepath)){next(err); return;}
	if(path.extname(filepath).toLowerCase() != ".ejs"){next(err); return;}

	if(do_next) res.next_router(); // this would execute next router
								   // instead next(); which would 
					   			   // execute the next renderer
}

//middleware is used outside main app. it would called
//if a route need it, such as config.routes or
//*.njs file. so, this function is optional to use
//based on api documentary
module.exports.middleware = function(req,res,next){
	// Base Script
	//...here is place to build base script...
	do_next = true

	// Main Script
	//...write your main code here...
	// there are some plugins which add some property :
	//		req.filepath
	// 		req.app.get("config");
	// 		req.app.renderTo(filepath, config={})(req,res,next);
	// 		res.renderTo(filepath, config={}, callback=function(err){});
	// 	you could read another property (especially property that often 
	//  used) in references.js

	if(do_next) next(); //this would automate router
						//to execute next route.
}
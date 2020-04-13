/**
 * @name HTTPS
 * @author FarhanMS123
 * @version 1.0.0, 04/13/20
 * @usefor plugin
 * @requires https
 * 
 * 		- module.exports(main, main_process, config); //plugin
 *              - app.get("https")
 *              - app.get("https_listen")
 *              - app.get("config").https
 * 
 * @see {@link https://nodejs.org/dist/latest-v13.x/docs/api/https.html#https_https_createserver_options_requestlistener NodeJS HTTPS CreateServer}
 */

// Modules Required
var https = require("https");

var https_server = undefined;

module.exports = function(main, main_process, config){
	// main == global
	//...here would be the first script to be run...
	main_process.on("serverCreated", function(app){
		// https://expressjs.com/en/4x/api.html#app
		// this event would be emitted while app
		// had been inittied in main process
		// app is the express application
		app.on("appListening", function(listen){
			// https://nodejs.org/dist/latest-v12.x/docs/api/net.html#net_event_listening
			// this event would be emitted while the app
			// is listening for a new connection.
            // `listen` property is com from net socket.
            if(https_server == undefined){
                https_server = https.createServer(config.https, app);
                https_server_listen = https_server.listen(config.https);
                app.set("https", https_server);
                app.set("https_listen", https_server_listen);
                setTimeout(function(){
                    console.log("SSL Connection Created");
                   console.log(`Listening on ${config.https.port}`);
                }, 2000);
            }
		});
	});
	// All process, http, and http events still worked
	// https://nodejs.org/dist/latest-v12.x/docs/api/process.html#process_process_events
	// https://nodejs.org/dist/latest-v12.x/docs/api/http.html#http_class_http_server
	// https://nodejs.org/dist/latest-v12.x/docs/api/net.html#net_class_net_server
}
/*
	Title 	    : Webserver V2.0.0
	Author	    : FarhanMS123
	Version	    : 2.0.0
	Date	    : 2018/10/19
	Repos	    : https://github.com/FarhanMS123/.
	Modules	    : express, multer
	
    Inspired to Jekyll and XAMPP.
	
	WebServer is an app to create a basic webserver based on expressjs.
	You should configurated it from config.js

	plugins is a bunch of functions which run in sequences.
	Each function has 3 arguments, they are global, process, config.
	You could put plugins as function, or import it via require()
	module.exports = function(global, process, config){}
	module.exports = function(main, main_process, config){}

	There are some custom events that emitted from here.
	From process, you could listen for
		.on("configurated", function(config){});
		.on("modluesImported", function(express){});
		.on("serverCreated", function(app){});
		included events from
			NodeJS Process < https://nodejs.org/dist/latest-v12.x/docs/api/process.html#process_process_events >
	For app, you could listen for :
		.on("serverCreated", function(app){});
		.on("configSetted", function(config){});
		.on("settingtMiddlewares", function(app){});
		.on("middlewaresSetted", function(app){});
		.on("appListening", function(listen){});
		emitted Net Server Listen
		included events from
			NodeJS HTTP Server < https://nodejs.org/dist/latest-v12.x/docs/api/http.html#http_class_http_server >
			NodeJS Net Server < https://nodejs.org/dist/latest-v12.x/docs/api/net.html#net_class_net_server >
			NodeJS Net Server Listen < https://nodejs.org/dist/latest-v12.x/docs/api/net.html#net_event_listening >
*/

// Do not change any code below if you don't know the consequences
//process error handling
process.on('uncaughtException', function(err){
	console.log([err]);
});

// Get Config and Run all plugins
var config = global.config = require("./config.js");
/**
 * `base_url` is really bad to be understand by user and 
 * 				really useless that would make them did
 * 				something stupid. so for now, its better 
 * 				to deprecated it.
 */
if(!Boolean(config.base_url)) config.base_url = "/*"

if(typeof config.plugins[0] == "function") config.plugins.forEach(function(value, index, array){
	//plugins could get anything from global
	//events can be listened via process.on and app.on
	value(global, process, config);
});
process.emit("configurated", config); //events

//Main Module
var express = global.express = require("express");
process.emit("modulesRequired", express); //events

//Functions Added
function middleware_next(req,res,next){
    if(typeof next == "function") next();
}
function removeModule(main_global, event){
    main_global.removeModule = function(module_name, includeSubmodule=false){
        module_name = require.resolve(module_name);
        if(typeof require.cache[module_name] == "object"){
            if(includeSubmodule) if(typeof require.cache[module_name].children == "object") if(require.cache[module_name].children.constructor == Array){
                for(var i=0;i<require.cache[module_name].children.length;i++){
                    global.removeModule(require.cache[module_name].children[i].id, true);
                }
            }
            delete require.cache[module_name];
            return true;
        }
        return false
    }
}
Array.prototype.insert = function(index, value){
	if(index < 0) index = this.length + index;
	if(index > this.length){
		this[index] = value;
	}else{
		for(var i=this.length; i>=index; i--){
			this[i] = this[i-1];
			if(i == index) this[i] = value;
		}
	}
	return this.length;
}
global.middleware_next = middleware_next;
global.removeModule = removeModule;

//Main Declaration
var app = global.app = express();
process.emit("serverCreated", app);  //events
app.emit("serverCreated", app); //events

//developper configuration
app.disable("etag");

app.set("config", config);
app.emit("configSetted", app.get("config"));  //events

app.emit("settingMiddlewares", app); //events

if(app.get("config").middlewares_use.length > 0) 
	app.use(app.get("config").middlewares_use);

if(app.get("config").middlewares_all.length > 0) 
	app.all(app.get("config").base_url, app.get("config").middlewares_all);

app.emit("middlewaresSetted", app); //events

app.set("listen", app.listen(app.get("config")));
app.emit("appListening", app.get("listen"));
// https://nodejs.org/dist/latest-v12.x/docs/api/net.html#net_event_listening

console.log("All plugins loaded");

console.log(`Webserver Active`);
console.log(app.get("config"));
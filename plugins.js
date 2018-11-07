/*
	PLUGINS
	Divided by 3 functions
	begin, it will run after declaring express and respond function
	middle, it will run after set variable for express and before declaring route
	last, it will run after execute listen function
	
	Plugins are putted in lib directory and required by require function
*/

module.exports.begin = function(){
	//Standard Modules
	
	//Included Functions
	
	//Main Modules
	
	//Main Declaration
	process.on("uncaughtException", function(err){
		console.log("Application Error!");
		console.log(err);
	});
	
	console.log("Plugin Execute : begin");
}
module.exports.middle = function(){
	//Standard Modules
	
	//Included Functions
	
	//Main Modules
	
	//Main Declaration
	s_exp.use("/*", function(req,res,next){
		removeModule(require.resolve("./response.js"), true);
		global.resp_func = require("./response.js")(req,res,function(){},"use");
	});
	
	console.log("Plugin Execute : middle");
}
module.exports.last = function(){
	//Standard Modules
	var path = require("path");
	var fs = require("fs");
	var url = require("url");
	
	//Included Functions
	
	//Main Modules
	
	//Main Declaration
	//WebSocket
	global.ws = require("ws");
	
	global.wss = new ws.Server({server:s_exp.get("applisten")});
	
	wss.on("error", function(err){
		console.log("WebSocket Error");
		console.log(err);
	});

	wss.on("connection", function(ws, req){
		ws.req = req;
		req.ws = ws;
		
		removeModule(require.resolve("./htconfig.js"), true);
		var fullpath = require("./htconfig.js")(req,ws,(function(){}),"ws");
		fullpath = path.resolve(typeof fullpath=="string" ? fullpath : path.join(s_exp.get("web"), decodeURIComponent(url.parse(req.url).pathname)));
		
		console.log(`Request [WebScoket] ${req.url}`);
		console.log(`Respond [WebScoket] ${fullpath}`);
		
		if(fs.existsSync(fullpath)){
			var pathstat = fs.statSync(fullpath);
			if(pathstat.isFile()){
				if(path.extname(fullpath) == ".ws"){
					removeModule(require.resolve(fullpath), true);
					require(fullpath)(ws,req);
				}else{
					ws.send("Error 406 : Not Acceptable");
					ws.close();
				}
			}else{
				ws.send("Error 406 : Not Acceptable");
				ws.close();
			}
		}else{
			ws.send("Error 404 : Not found");
			ws.close();
		}
	});
	
	console.log("Plugin Execute : last");
}
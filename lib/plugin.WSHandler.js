//Module Imported
var fs = require("fs");
var path = require("path");
var url = require("url");

var ws = require("ws");

var wss, wsss;

module.exports.plugin = function(main, main_process, config){
	main_process.on("serverCreated", function(app){
		app.on("appListening", function(listen){
			function ws_conn(ws, req){
				ws.req = req;
				req.ws = ws;

				req.main = main;
				req.main_process = main_process;
				req.config = config;
				req.app = app;

				var url_parse = url.parse(req.url);
				req.filepath = path.resolve(path.join(config.web_folder, path.join(url_parse.pathname)));
				
				if(fs.existsSync(req.filepath)){
					var pathstat = fs.statSync(req.filepath);
					if(pathstat.isFile()){
						if(path.extname(req.filepath).toLowerCase() == ".ws"){
							removeModule(require.resolve(req.filepath), true);
							require(req.filepath)(ws, req);
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
			}
			function ws_err(err){
				console.log("WebSocket Error");
				console.log(err);
			}
			
			wss = new ws.Server({server: listen});
			wss.on("connection", ws_conn).on("error", ws_err);

			setTimeout(function(){
				if(app.get("https_listen")){
					wsss = new ws.Server({server: app.get("https_listen")});
					wsss.on("connection", ws_conn).on("error", ws_err);
				}
			}, 100);
		});
	});
}
module.exports.renderer = function renderer(req,res,next){
	//Base Script
	if(res.finished){next(); return;}

	//Main Declaration
	var isRenderer = req.renderer ? true : false;
	var filepath = isRenderer ? req.renderer : req.filepath;
	if(!fs.existsSync(filepath)){next(); return;}
	if(path.extname(filepath).toLowerCase() != ".ws"){next(); return;}
	
	res.status(405);

	res.next_router();
}

function removeModule(module_name, includeSubmodule=false){
	module_name = require.resolve(module_name);
	if(typeof require.cache[module_name] == "object"){
		if(includeSubmodule) if(typeof require.cache[module_name].children == "object") 
			if(require.cache[module_name].children.constructor == Array){
				for(var i=0;i<require.cache[module_name].children.length;i++){
					removeModule(require.cache[module_name].children[i].id, true);
				}
			};
		delete require.cache[module_name];
		return true;
	}
	return false
}
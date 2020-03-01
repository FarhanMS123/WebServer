var fs = require("fs");
var path = require("path");
var url = require("url");

var ws = require("ws");

var wss;

module.exports.plugin = function(main, main_process, config){
	main_process.on("serverCreated", function(app){
		app.on("appListening", function(listen){
			wss = new ws.Server({server: listen});

			wss.on("connection", function(ws, req){
				ws.req = req;
				req.ws = ws;

				console.log(req);
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
			}).on("error", function(err){
				console.log("WebSocket Error");
				console.log(err);
			});
		});
	});
}
module.exports.router = function router(req,res,next){
	//OnErr Request Handler
	var err = undefined, do_next = true;
	if(arguments[3]){
		err = req;
		req = res;
		res = next;
		next = arguments[3];
	}
	// if(do_next) next(err);
	//if(res.statusCode != 200){next(err); return;}
	if(res.finished){next(err); return;}

	//Module Imported
	var fs = require("fs");
	var path = require("path");

	//Main Declaration
	var isRenderer = req.renderer ? true : false;
	var filepath = isRenderer ? req.renderer : req.filepath;
	if(!fs.existsSync(filepath)){next(err); return;}
	if(path.extname(filepath).toLowerCase() != ".ws"){next(err); return;}
	
	res.status(405);

	res.next_router(err);
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
module.exports = function(opt, web_server){
	global.ws = require("ws");
	
	global.wss = new ws.Server(opt);
	
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
					ws.send("Error 415 : Unsupported media type");
					ws.close();
				}
			}else{
				ws.send("Error 415 : Unsupported media type");
				ws.close();
			}
		}else{
			ws.send("Error 404 : Not found");
			ws.close();
		}
	});
}
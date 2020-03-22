//Module Imported
var fs = require("fs");
var path = require("path");
var ejs = require("ejs");
var util = require("util");
var postHandler = require("./middleware.PostHandler.js")

//module.exports = function(ejs_opt){return function(req,res,next){res.send("hello, world! 6"); next();}}
module.exports = function(ejs_opt){
	function post_handler(req,res,next){
		// Base Script
		if(res.finished) return next();

		//Main Script
		var filepath = req.renderer ? req.renderer : req.filepath;
		if(!fs.existsSync(filepath)) return next();
		if(path.extname(filepath).toLowerCase() != ".ejs") return next();

		return postHandler(req,res,next);
	}
	function renderer(req,res,next){
		//Base Script
		if(res.finished) return next();

		//Main Script
		var filepath = req.renderer ? req.renderer : req.filepath;
		if(!fs.existsSync(filepath)) return next();
		if(path.extname(filepath).toLowerCase() != ".ejs") return next();

		req.renderer_config.require = require;
		req.renderer_config.main_global = global;
		req.renderer_config.ejs_opt = ejs_opt;
		
		var renderedFile = ejs.renderFile(filepath, req.renderer_config, ejs_opt, function(err, ret){
			var prom = ret.constructor == Promise ? ret : undefined;
			var html = ret.constructor == Promise ? "" : ret;
			if(err){
				html = "<textarea id='txaError' style='width:calc(100% - 2em);height:11em;'>" + util.inspect(err) + "</textarea>" + 
					"<script>var txaError = document.getElementById('txaError'); txaError.style.height = txaError.scrollHeight + 12</script>" +
					"<br />" + html;
				console.log(err);
			}
			if(prom){
				prom.then(function(ret2){
					html += ret2;
					res.send(html);
					res.next_router(err);
				}).catch(function(e){
					html += "<textarea id='txaError' style='width:calc(100% - 2em);height:11em;'>" + util.inspect(e) + "</textarea>" + 
					"<script>var txaError = document.getElementById('txaError'); txaError.style.height = txaError.scrollHeight + 12</script>" +
					"<br />" + html;
					res.send(html);
					res.next_router(err);
				});
			}else{
				res.send(html);
				res.next_router(err);
			}
		});
	}
	var arrRet = [renderer];
	if(ejs_opt.handlePOST) arrRet.unshift(post_handler);
	return arrRet;
}
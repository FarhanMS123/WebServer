//Module Imported
var ejs = require("ejs");
var util = require("util");
var postHandler = require("./middleware.PostHandler.js")

//module.exports = function(ejs_opt){return function(req,res,next){res.send("hello, world! 6"); next();}}
module.exports = function(ejs_opt){
	function post_handler(req,res,next){
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

		//Main Declaration
		var filepath = req.renderer ? req.renderer : req.filepath;
		if(!fs.existsSync(filepath)){next(err); return;}
		if(path.extname(filepath).toLowerCase() != ".ejs"){next(err); return;}

		return postHandler(req,res,next);
	}
	function renderer(req,res,next){
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

		//Main Declaration
		var filepath = req.renderer ? req.renderer : req.filepath;
		if(!fs.existsSync(filepath)){next(err); return;}
		if(path.extname(filepath).toLowerCase() != ".ejs"){next(err); return;}

		req.renderer_config.require = require;
		req.renderer_config.main_global = global;
		req.renderer_config.ejs_opt = ejs_opt;
		//req.renderer_config.handlePOST = function(cb=function(err){}){return err ? postHandler(err,req,res,cb) : postHandler(req,res,cb);}

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
				//function test(label){return (function(){console.log([label, arguments])}); }
				//prom.then(test("resolve"), test("reject")).finally(test("finally")).catch(test("catch"));
				prom.then(function(ret2){
					html += ret2;
					//console.log([1, req.originalUrl, arguments]);
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
				//console.log([3, req.originalUrl]);
				res.send(html);
				res.next_router(err);
			}
		});
	}
	return [post_handler, renderer];
	// post_handler, 
}
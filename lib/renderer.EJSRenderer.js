//Module Imported
var ejs = require("ejs");
var util = require("util");
var postHandler = require("./lib/middleware.PostHandler.js")

module.exports = function(ejs_opt){
	return function(req,res,next){
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
		req.renderer_config.handlePOST = function(cb=function(err){}){return err ? postHandler(err,req,res,cb) : postHandler(req,res,cb);}

		ejs.renderFile(filepath, req.renderer_config, ejs_opt, function(err, str){
			if(err){
				str = "<textarea id='txaError' style='width:calc(100% - 2em);height:11em;'>" + util.inspect(err) + "</textarea>" + 
					"<script>var txaError = document.getElementById('txaError'); txaError.style.height = txaError.scrollHeight + 12</script>" +
					"<br />" + (str ? str : "");
			}
			res.send(str);
		});

		res.next_router(err);
	}
}
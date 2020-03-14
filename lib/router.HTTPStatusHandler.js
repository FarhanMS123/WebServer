module.exports = function(req,res,next){
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
	var config = {
		status_code : res.statusCode,
		webpath: req.path,
		filepath: req.filepath,
	}
	if(res.renderTo){
		if(req.app.get("config").http_error[res.statusCode]){
			res.renderTo(req.app.get("config").http_error[res.statusCode], config, next);
		}else if(req.app.get("config").http_error["default"]){
			res.renderTo(req.app.get("config").http_error["default"], config, next);
		}else{
			res.sendStatus(res.statusCode);
		}
	}else{
		res.sendStatus(res.statusCode);
	}

	if(do_next) next(err);
}
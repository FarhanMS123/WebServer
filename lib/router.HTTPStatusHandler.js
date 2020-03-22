// Module Required
var fs = require("fs");
var path = require("path");

module.exports = function(req,res,next){
    //Base Script
	var do_next = true;
	if(res.finished) return next(); 

	//Main Script
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

	if(do_next) next();
}
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
	var express = require("express");

	//Main Declaration
	var isRenderer = req.renderer ? true : false;
	var filepath = isRenderer ? req.renderer : req.filepath;
	if(!fs.existsSync(filepath)){next(err); return;}
	if(path.extname(filepath).toLowerCase() != ".njs"){next(err); return;}
	
	removeModule(filepath, true);

	var router = express.Router();
	router.use(require(filepath));
	if(err){
		router(err,req,res,res.next_router);
	}else{
		router(req,res,res.next_router);
	}
}

module.exports.routes = function(req,res,next){
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

	var path = require("path");
	var fs = require("fs");

	var filepath = req.filepath.split(path.sep);
	var filepath_str = filepath[0];

	for(i=1; i<filepath.length; i++){
		filepath_str = path.join(filepath_str, filepath[i]);
		if(fs.statSync(filepath_str).isFile()){
			req.filepath = filepath_str;
			res.status(200);
			next();
			break;
		}
	}
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
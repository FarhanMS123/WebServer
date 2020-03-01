/**
 * propertise:
 * renderer(main, main_process, config); //for plugin
 * 		set:
 * 		app.rendererRouter(req,res,next); //same as renderer.router
 * 		app.renderTo(filename, config={})(req,res,next); //same as renderer.renderTo
 * renderer.renderTo(filename, config={})(req,res,next) //to renderer
 * 		set:
 * 		req.renderer
 * 		req.renderer_list
 * 		req.renderer_config
 * renderer.router(req,res,next); //for router
 */

var fs = require("fs");
var express = require("express");
var router = express.Router();

function func_router(req,res,next){
	//OnErr Request Handler & Status Checker
	var err = undefined, do_next = true;
	if(arguments[3]){
		err = req;
		req = res;
		res = next;
		next = arguments[3];
	}

	if(!res._next_router) res._next_router = [];
	if(res.next_router) res._next_router.push(res.next_router);

	res.next_router = function(err){
		res.next_router = res._next_router.pop();
		return next(err);
	};

	if(!req.renderer_config) req.renderer_config = {};
	if(req.renderer_config.constructor != Object) req.renderer_config = {};
	req.renderer_config.main_global = global;
	req.renderer_config.err = err;
	req.renderer_config.req = req;
	req.renderer_config.res = res;
	req.renderer_config.next = next;

	if(err){
		router(err,req,res,next);
	}else{
		router(req,res,next);
	}
};

function renderTo(filename, config={}){
	return function(req,res,next){
		//OnErr Request Handler & Status Checker
		var err = undefined, do_next = true;
		if(arguments[3]){
			err = req;
			req = res;
			res = next;
			next = arguments[3];
		}

		if(!fs.existsSync(filename)){res.status(501); next(err); return;}
		console.log("renderTo 2");
		if(typeof filename == "string") req.renderer = filename;
		if(!req.renderer_list) req.renderer_list = [];
		if(req.renderer_list.constructor != Array) req.renderer_list = [];

		if(!req.renderer_config) req.renderer_config = {};
		if(req.renderer_config.constructor != Object) req.renderer_config = {};
		req.renderer_config.main_global = global;
		req.renderer_config.err = err;
		req.renderer_config.req = req;
		req.renderer_config.res = res;
		req.renderer_config.next = next;

		//if(typeof filename == "string") return;
		req.renderer_list.push(filename);

		for(name in config){
			req.renderer_config[name] = config[name];
		}

		if(err){
			func_router(err,req,res,next);
		}else{
			func_router(req,res,next);
		}
	}
}

function plugin(main, main_process, config){
	if(typeof config.renderer == "object") 
		if(config.renderer.constructor == Array) 
			if(config.renderer.length > 0) router.use(config.renderer);
	main_process.on("serverCreated", function(app){
		app.rendererRouter = router;
		app.renderTo = renderTo;
	});
}

module.exports=plugin;

module.exports.router = func_router;

module.exports.renderTo = renderTo;
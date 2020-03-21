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
 * 		res.next_router(err)
 * renderer.router(req,res,next); //for router
 * renderer.router_res_renderTo(req,res,next)
 * 		set:
 * 		res.renderTo(filename, config={}, callback=function(err){}) //callback is same as `next`
 */

var fs = require("fs");
var express = require("express");
var router = express.Router();

function router_res_renderTo(req,res,next){
	//OnErr Request Handler & Status Checker
	var err = undefined, do_next = true;
	if(arguments[3]){
		err = req;
		req = res;
		res = next;
		next = arguments[3];
	}

	if(err){
		res.renderTo = function(filename, config={}, callback=function(err){}){
			return renderTo(filename, config)(err,req,res,callback)
		}
	}else{
		res.renderTo = function(filename, config={}, callback=function(err){}){
			return renderTo(filename, config)(req,res,callback)
		}
	}

	next(err);
}

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

	//if(!req.renderer_config.main_global) req.renderer_config.main_global = global;
	if(!req.renderer_config.err) req.renderer_config.err = err;
	if(!req.renderer_config.req) req.renderer_config.req = req;
	if(!req.renderer_config.res) req.renderer_config.res = res;
	if(!req.renderer_config.next) req.renderer_config.next = next;
	if(!req.renderer_config.config) req.renderer_config.config = req.renderer_config;
	//if(!req.renderer_config.require) req.renderer_config.require = require;

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

		if(req.renderer_list) if(req.renderer_list.constructor == Array) req.renderer_list.push(req.renderer);
		
		if(typeof filename == "string") req.renderer = filename;
		if(!req.renderer_list) req.renderer_list = [];
		if(req.renderer_list.constructor != Array) req.renderer_list = [];

		if(!req.renderer_config) req.renderer_config = {};
		if(req.renderer_config.constructor != Object) req.renderer_config = {};

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

module.exports.router_res_renderTo = router_res_renderTo;
/**
 * Title	 : Renderer
 * Author	 : FarhanMS123
 * Using for : plugin, router
 * 
 * Caller :
 * module.exports(main, main_process, config); //for plugin
 * 		app.rendererRouter(req,res,next); //same as renderer.router
 * 		app.renderTo(filename, config={})(req,res,next); //same as renderer.renderTo
 * module.exports.renderTo(filename, config={})(req,res,next) //to renderer
 * 		req.renderer = filepath;
 * 		req.renderer_list = []
 * 		req.renderer_config = {}
 * module.exports.router(req,res,next); //for router
 * 		req.renderer_config = {req,res,next,config};
 * 		res.next_router(err);
 * module.exports.router_res_renderTo(req,res,next)
 * 		res.renderTo(filename, config={}, callback=function(err){}) //callback is same as `next`
 */

var fs = require("fs");
var express = require("express");
var router = express.Router();

function router_res_renderTo(req,res,next){
	res.renderTo = function(filename, config={}, callback=function(err){}){
		return renderTo(filename, config)(req,res,callback)
	}

	next();
}

function func_router(req,res,next){
	// Main Script

	// Base script for `next_router`
	if(!res._next_router) res._next_router = [];
	if(res.next_router) res._next_router.push(res.next_router);

	/**
	 * this would execute next router instead next renderer.
	 * use this functions while you had finised rendering
	 * or use this as callback to a renderer
	 * please remind to not use next();
	 */
	res.next_router = function next_router(err){
		res.next_router = res._next_router.pop();
		return next(err);
	};

	//ussually renderer such as ejs needs a config to
	//set some data to renderer.
	if(!req.renderer_config) req.renderer_config = {};
	if(req.renderer_config.constructor != Object) req.renderer_config = {};

	if(!req.renderer_config.req) req.renderer_config.req = req;
	if(!req.renderer_config.res) req.renderer_config.res = res;
	if(!req.renderer_config.next) req.renderer_config.next = next;
	if(!req.renderer_config.config) req.renderer_config.config = req.renderer_config;

	return router(req,res,next);
};

function renderTo(filename, config={}){
	return function(req,res,next){
		// check if file template exist
		if(!fs.existsSync(filename)){res.status(501); next(); return;}
		
		//add the last renderer to the list
		if(req.renderer_list) if(req.renderer_list.constructor == Array) req.renderer_list.push(req.renderer);
		
		//set the `req.renderer` to be path of the last renderer
		if(typeof filename == "string") req.renderer = filename;
		if(!req.renderer_list) req.renderer_list = [];
		if(req.renderer_list.constructor != Array) req.renderer_list = [];

		if(!req.renderer_config) req.renderer_config = {};
		if(req.renderer_config.constructor != Object) req.renderer_config = {};

		for(name in config){
			req.renderer_config[name] = config[name];
		}

		return func_router(req,res,next);
	}
}

function plugin(main, main_process, config){
	if(typeof config.renderer == "object") 
		if(config.renderer.constructor == Array) 
			if(config.renderer.length > 0) router.use(config.renderer);
	main_process.on("serverCreated", function(app){
		app.rendererRouter = func_router;
		app.renderTo = renderTo;
	});
}

module.exports = plugin;
module.exports.router = func_router;
module.exports.renderTo = renderTo;
module.exports.router_res_renderTo = router_res_renderTo;
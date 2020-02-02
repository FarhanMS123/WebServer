var express = require("express");
var router = express.Router();

function renderTo(filename, config={}){
	return function(req,res,next){
		if(typeof filename == "string") req.renderer = filename;
		if(!req.renderer_list) req.renderer_list = [];
		if(req.renderer_list.constructor != Array) req.renderer_list = [];
		if(req.renderer_config.constructor != Object) req.renderer_config = {};

		if(typeof filename == "string") req.renderer_list.push(filename);

		for(name in config){
			req.renderer_config[name] = config[name];
		}

		router(req,res,next);
	}
}

module.exports=function(main, main_process, config){
	if(typeof config.renderer == "object") 
		if(config.renderer.constructor == Array) 
			if(config.renderer.length > 0)router.use(config.renderer);
	main_process.on("serverCreated", function(app){
		setInterval(function(){
			if(main.renderer){
				app.rendererRouter = router;
				app.renderTo = renderTo;
			}
		},1);
	});
}

module.exports.router = router;

module.exports.renderTo = renderTo;
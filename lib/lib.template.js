module.exports.plugin = function(main, main_process, config){
	// main == global
	main_process.on("configurated", function(config){
		//
	}).on("modluesRequired", function(fs, path, express){
		//
	}).on("serverCreated", function(app){
		//
		app.on("serverCreated", function(app){
			//
		}).on("configSetted", function(config){
			//
		}).on("setMiddlewares", function(app){
			//
		}).on("appListening", function(listen){
			//
		});
	});
}
module.exports.router = function(req,res,next){
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
	
	// main declaration here...
	// req.app.renderTo(filepath, {})(req,res,next);

	if(do_next) next(err);
}
module.exports.renderer = function(req,res,next){
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
	var isRenderer = req.renderer ? true : false;
	var filepath = isRenderer ? req.renderer : req.filepath;
	if(!fs.existsSync(filepath)){next(err); return;}
	if(path.extname(filepath).toLowerCase() != ".ejs"){next(err); return;}
	
	// script to rendering...
	// req.app.renderTo(filepath, {options})(req,res,next);

	res.next_router(err);
}
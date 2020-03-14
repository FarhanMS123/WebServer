module.exports = function(req,res,next){
	//OnErr Request Handler & Status Checker
	var err = undefined, do_next = true;
	if(arguments[3]){
		err = req;
		req = res;
		res = next;
		next = arguments[3];
	}
	// if(do_next) next(err);
	// if(res.statusCode != 200){next(err); return;}
	if(res.finished){next(err); return;}
	
	//Module Imported
	var fs = require("fs");
	var path = require("path");
	var ejs = require("ejs");
	var util = require("util");

	//Main Declaration
	//var dirpath = req.filepath;
	var dirpath = req.renderer ? req.renderer : req.filepath;
	if(!fs.existsSync(dirpath)){next(err); return;}

	var fsstat = fs.statSync(dirpath);
	if(!fsstat.isDirectory()){next(err); return;}
	//Folder List Dissalow
	//Remove group comment tag below to dissalow folder listing
	/* res.status(403);
	next(err);
	return; */

	var dirlist = fs.readdirSync(dirpath); // [{filename, filepath, webpath, stat}]
	dirlist.unshift(".", "..");
	for(i in dirlist){
		dirlist[i] = {filename:dirlist[i], filepath:path.join(dirpath, dirlist[i]), webpath:path.join(req.path, dirlist[i]), stat:fs.statSync(path.join(dirpath, dirlist[i]))}
	}
	var renderer_config = {dirpath, dirlist, webpath:req.path};
	
	var ejs_opt = {};
	if(res.renderTo && req.app.get("config").DirectoryViewTemplate){
		res.renderTo(req.app.get("config").DirectoryViewTemplate, renderer_config, res.next_router);
	}else{
		res.status(501);
		res.next_router(err);
	}
}
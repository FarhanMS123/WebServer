//Module Required
var fs = require("fs");
var path = require("path");

module.exports = function(req,res,next){
	//Base Script
	if(res.finished) return next(); 

	//Main Script
	var dirpath = req.renderer ? req.renderer : req.filepath;
	if(!fs.existsSync(dirpath)) return next(); 

	var fsstat = fs.statSync(dirpath);
	if(!fsstat.isDirectory()) return next();
	//Folder List Dissalow
	//remove group comment tag below to dissalow folder listing
	/* res.status(403);
	return next(); */

	var dirlist = fs.readdirSync(dirpath); // [{filename, filepath, webpath, stat}]
	dirlist.unshift(".", "..");
	for(i in dirlist){
		dirlist[i] = {filename:dirlist[i], filepath:path.join(dirpath, dirlist[i]), webpath:path.join(req.path, dirlist[i]), stat:fs.statSync(path.join(dirpath, dirlist[i]))}
	}

	var webpath = path.resolve(dirpath).slice(path.resolve(req.app.get("config").web_folder).length);
	webpath = webpath.replace(/\\/g, "/");
	if(webpath.substr(0,1) != "/") webpath = "/" + webpath;
	console.log(webpath);
	var renderer_config = {dirpath, dirlist, webpath, reqpath:req.path};
	
	var ejs_opt = {};
	if(res.renderTo && req.app.get("config").DirectoryViewTemplate){
		res.renderTo(req.app.get("config").DirectoryViewTemplate, renderer_config, res.next_router);
	}else{
		res.status(501);
		res.next_router();
	}
}
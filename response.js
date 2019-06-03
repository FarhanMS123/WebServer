/*
	response.js
	
	Is a function to serving client's request. It runs on /* route and will
	rerequired every request. there are many algorithm works here. Simply,
	there are checking existens of file or folder, giving index file, and
	write and send response to client. There will rerequired htconfig.js to
	resolved unexist or reroute file.
*/

module.exports = function(req,res,next,type){
	//Standard Modules
	var fs = require("fs");
	var path = require("path");
	
	//Included Functions
	
	//Main Modules
	
	//Declaration Functions
	removeModule(require.resolve("./htconfig.js"), true);
	var fullpath = require("./htconfig.js")(req,res,next);
	fullpath = path.resolve(typeof fullpath=="string" ? fullpath : path.join(s_exp.get("web"), decodeURIComponent(req.path)));
	
	if(fs.existsSync(fullpath)){
		var pathstat = fs.statSync(fullpath);
		if(pathstat.isDirectory()){
			var ifl = s_exp.get("index_file");
			var rds = fs.readdirSync(fullpath);
			var done=false;
			for(var i=0; i<ifl.length; i++){
				for(var j=0; j<rds.length; j++){
					if(ifl[i] == rds[j]){
						fullpath = path.join(fullpath, ifl[i]);
						done=true;
						break;
					}
				}
				if(done) break;
			}
		}
	}else{
		fullpath = path.join(s_exp.get("web"), "error/403.njs");
	}
	
	var pathstat = fs.existsSync(fullpath) ? fs.statSync(fullpath) : undefined;
	if(type==undefined) console.log(`Respond ${fullpath}`);
	if(type==undefined){
		switch(true){
			case (!fs.existsSync(fullpath)):
				res.status(404);
				res.send(`<h4>Error 404: <i>${req.path}</i> not found.<h4>`);
				break;
			case pathstat.isDirectory():
				var dt = `<h1>Index of ${req.path}</h1><br />\n`;
				dt += `<style>th{text-align:center;}</style>\n`
				dt += "<table style='width:50em;'>\n";
				dt += "<tr><th>Name</th><th>Size</th><th>Date Modified</th></tr>\n";
				var rds = fs.readdirSync(fullpath);
				for(var i=0;i<rds.length;i++){
					var fst = fs.statSync(path.join(fullpath,rds[i]));
					dt += `<tr><td><a href="${path.join(req.path, rds[i])}">${rds[i]}</a></td><td>${fst.size} B</td><td>${fst.mtime.toString()}</td></tr>\n`;
				}
				dt += "</table>";
				res.send(dt);
				break;
			case (path.extname(fullpath).toLowerCase() == ".ws"):
				res.status(404);
				res.send(`<h4>Error 406: <i>${req.path}</i> not acceptable.<h4>`);
				break;
			case (path.extname(fullpath).toLowerCase() == ".njs"):
				removeModule(require.resolve(fullpath), true);
				require(fullpath)(req,res,next);
				break;
			case (path.extname(fullpath).toLowerCase() == ".ejs"):
				var ejs = require("ejs");
				var multer = require("multer");
				var req=req, res=res;
				multer({dest:"./web/tmp"}).any()(req,res,function(){
					res.send(ejs.renderFile(fullpath, {main_global:global, req:req, res:res}));
				});
				break;
			default:
				//res.set("Content-Type", mimeTypes.lookup(fullpath));
				res.type(fullpath);
				res.send(fs.readFileSync(fullpath).toString());
				//res.sendFile(fullpath);
		}
	}else if(type=="use"){
		switch(true){
			case (!fs.existsSync(fullpath)):
				break;
			case pathstat.isDirectory():
				break;
			case (path.extname(fullpath).toLowerCase() == ".njs"):
				removeModule(require.resolve(fullpath), true);
				var mod = require(fullpath);
				if(typeof mod.use=="function") mod.use(req,res,function(){});
				break;
			case (path.extname(fullpath).toLowerCase() == ".ejs"):
				
				break;
		}
	}
}
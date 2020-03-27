var express = require("express");

module.exports = function(req,res,next){
	//Base Script
	if(res.finished) return next();

	//Main Script
	var fs = require("fs");
	var mimeTypes = require("mime-types");

	//Main Declaration
	var filepath = req.renderer ? req.renderer : req.filepath;
	if(!fs.existsSync(filepath)) return next();
	
	//res.set("Content-Type", mimeTypes.lookup(filepath));
	//res.type(filepath);

	//res.send(fs.readFileSync(filepath));
	//res.sendFile(filepath);

	var config = req.app.get("config");
	express.static(config.web_folder, config.exp_static)(req,res,res.next_router);

	//res.next_router();
}
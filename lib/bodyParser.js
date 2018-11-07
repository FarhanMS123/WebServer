module.exports = function(req,res,folder_path){
	var fs = require("fs");
	var path = require("path");
	
	var bodyParser = require('body-parser');
	var multer = require('multer');
	
	if(typeof folder_path == "string"){
		folder_path = path.resolve(folder_path);
		if(fs.existSync(folder_path)){
			var stats = fs.statSync(folder_path);
			if(!stats.isDirectory()) folder_path = path.resolve("./");
		}else{
			folder_path = path.resolve("./");
		}
	}else{
		folder_path = path.resolve("./");
	}
	
	bodyParser.json()(req,res,function(){}); // for parsing application/json
	bodyParser.urlencoded({ extended: true })(req,res,function(){}); // for parsing application/x-www-form-urlencoded
	multer({dest:folder_path}).any()(req,res,function(){}); //for parsing multiform
}
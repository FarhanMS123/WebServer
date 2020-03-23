// https://github.com/expressjs/multer
// https://github.com/expressjs/multer/blob/master/StorageEngine.md

var fs = require("fs");
var path = require("path");

var express = require("express");
var bodyParser = require('body-parser')
var multer = require("multer");

var multerMW = false;
var router = express.Router();
router.use(bodyParser.json(), bodyParser.raw(), bodyParser.text(), bodyParser.urlencoded({extended: true}));

module.exports = function(req, res, next){
	//Base Script
	if(res.finished){next(err); return;}

	//Main Script
	if(multerMW == false){
		multerMW = multer({
			dest: path.resolve(req.app.get("config").tmp_folder)
		}).any();
		function fileHandler(req,res,next){
			for(file_index in req.files){
				file = req.files[file_index];
				file.autoDelete = true;
				file.rename = function rename(newname){
					file.autoDelete = false;
					return fs.renameSync(file.path, newname);
				};
			}
			next();
		}
		router.all("/*", multerMW, fileHandler);
	}
	
	return router(req,res,next);
}

module.exports.autoDelete = function(req,res,next){
	if(req.files) 
		for(file_index in req.files){
			file = req.files[file_index];
			if(file.autoDelete) fs.unlinkSync(file.path)
		};
	next();
}

//this is just a template
function multerEngine(opts){
	var getDestination = opt.destination || function(req, file, cb){cb(null, "/dev/null")};

	return {
		_handleFile : function(req, file, cb){
			getDestination(req, file, function(err, path){
				if(err) return cb(err);

				//script begin
			})
		},
		_removeFile : function(req, file, cb){
			fs.unlink(file.path, cb);
		}
	}
}
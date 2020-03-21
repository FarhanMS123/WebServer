// https://github.com/expressjs/multer
// https://github.com/expressjs/multer/blob/master/StorageEngine.md

//console.log("hello");
var fs = require("fs");
var path = require("path");

var express = require("express");
var bodyParser = require('body-parser')
var multer = require("multer");

var multerMW = false;
var router = express.Router();
router.use(bodyParser.json(), 
	bodyParser.raw(), 
	bodyParser.text(), 
	bodyParser.urlencoded({extended: true}));
/**
 * router giving error have sent
 * should be fixied soon.
 * 
 * the problem is, it would do the function twice.
 * the problem is the router.
 */

//module.exports = function(req,res,next){console.log([6]); next();}
module.exports = function(req, res, next){
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

	if(multerMW == false){
		//console.log("call me");
		multerMW = multer({
			dest: path.resolve(req.app.get("config").tmp_folder)
		}).any();
		router.all("/*", multerMW);
	}
	
	if(err){
		return router(err,req,res,next);
	}else{
		return router(req,res,next);
	}
}

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
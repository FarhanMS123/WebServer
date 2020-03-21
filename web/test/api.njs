var express = require("express");
var bodyParser = require('body-parser')
var multer = require("multer");
var path = require("path");
var util = require("util");

var multerMW = false;
var router_POST = express.Router();
function mid_multerMW(req,res,next){
	if(multerMW == false){
		multerMW = multer({
			dest: path.resolve(req.app.get("config").tmp_folder)
		}).any();
	}
	return multerMW(req,res,next);
}
router_POST.use(mid_multerMW, bodyParser.json(), bodyParser.raw(), bodyParser.text(), bodyParser.urlencoded({extended: true}));

//var PostHandler =  require("../../lib/middleware.PostHandler.js");

var router = express.Router();
router.all("/*/api.njs/:name/:type", function(req,res,next){
	res.send({
		name: req.params.name,
		type: req.params.type,
		message: req.query.message,
		fullfill: req.query.fullfill
	});
	next();
}).all("/*/api.njs/upload", function(req,res,next){
	//var req_txt = util.inspect(req);
	res.send({
		query: req.query, 
		files: req.files, 
		body: req.body, 
		method: req.method,
		"content-type": req.headers["content-type"]
	});
	//next();
});

module.exports = router;
//module.exports = function(req,res,next){res.send("hehe"); console.log([32]); next();}
//PostHandler, 
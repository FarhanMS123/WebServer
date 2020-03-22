var express = require("express");

var PostHandler =  require("../../lib/middleware.PostHandler.js");

var router = express.Router();
router.all("/*/api.njs/:name/:type", function(req,res,next){
	res.send({
		name: req.params.name,
		type: req.params.type,
		message: req.query.message,
		fullfill: req.query.fullfill
	});
	next();
}).all("/*/api.njs/upload", PostHandler, function(req,res,next){
	res.send({
		query: req.query, 
		files: req.files, 
		body: req.body, 
		method: req.method,
		"content-type": req.headers["content-type"]
	});
	next();
});

module.exports = router;
var path = require("path");
var express = require("express");

var PostHandler =  require(path.resolve(global.app.get("router"), "middleware.PostHandler.js"));

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

module.exports = function(path, opts, cb){
	// NJS is using express engine
	// opts = {app, req, res, views, render_opts, render_cb, _locals, settings};

	router(opts.req, opts.res, opts.next);
};
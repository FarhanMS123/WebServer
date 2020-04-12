/**
 * This is reroutes.js plugins
 * It would get all, routes in config.routes propertise
 * the propertise should be set as
 * "/URL/on/Web/as/RegExp/String": HTTPStatusCode<number:403,404> | "/Routes/to/Another/Path"<string> | function(req,res,next){}
 * For examples :
 *	"/dir1/*" : "/dir2/index.html",
 *	"/file1/*" : "301 /dir2/file1.html",
 *	"/google" : "https://google.com"
 *	"/bugs" : "404 https://stackoverflow.com"
 *	"/nothing" : 404
 *	"/handled" : "FILE ./web/index.html"
 *	"/by/func" : function([err,]req,res,next){}
 */

// Modules Required
var path = require("path");
var fs = require("fs");
var patchMatch = require('path-match');
var match = patchMatch({});
var mustache = require("mustache");

module.exports= function(req,res,next){
	//Base Script
	do_next = true;

	//Main Script
	//Get Routes List
	var routes = req.app.get("config").routes;
	for(i in routes){
		var params = match(i)(req.originalUrl);
		if((i.substr(0,1) == "^" && i.substr(-1,1) == "$" && Boolean(new RegExp(i, "g").exec(req.originalUrl))) || (params !== false)){
			if(typeof routes[i] == "string"){ //redirect to link or use the file
				var routes_i = mustache.render(routes[i], params);
				if(/^FILE /.exec(routes_i)){ //use or render by another file, if exist 200
					var filepath = path.resolve(routes_i.slice(5));
					if(fs.existsSync(filepath)) res.status(200);
					req._filepath = req.filepath;
					req.filepath = filepath;
				}else if(routes_i.length == 3 && typeof parseInt(routes_i) == "number"){
					res.status(parseInt(routes_i));
					req.filepath = false;
				}else if(parseInt(routes_i.slice(0, 3))){ //set http status code and redirect to somewhere
					var http_status_code = parseInt(routes_i.slice(0, 3));
					var redirect_link = routes_i.slice(4);

					res.redirect(http_status_code, redirect_link);
				}else{
					res.redirect(routes_i);
				}
			}else if(typeof routes[i] == "number"){ //set http status code
				res.status(routes[i]);
			}else if(typeof routes[i] == "function"){ //do something with function
				if(err){
					routes[i](err,req,res,next);
				}else{
					routes[i](req,res,next);
				}
				do_next = false;
			}
			break;
		}
	}
	if(do_next) next();
}

module.exports.fixRenderer = function(req,res,next){
	if(req.filepath == false) return req.next_router();
	return next();
}
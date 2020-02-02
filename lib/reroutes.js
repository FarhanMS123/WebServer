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

module.exports = function(req,res,next){
	//OnErr Request Handler
	var err = undefined, do_next = true;
	if(arguments[3]){
		err = req;
		req = res;
		res = next;
		next = arguments[3]; // if(do_next) next(err);
	}
	
	//Module Imported
	var path = require("path");

	//Get Routes List
	var routes = req.app.get("config").routes;
	for(i in routes){
		if(new RegExp(`^${i}(\\?*)?$`, "ig").exec(req.originalUrl)){
			if(typeof routes[i] == "string"){
				if(/^FILE /.exec(routes[i])){
					req.realpath = path.resolve(routes[i].slice(5));
				}else if(parseInt(routes[i].slice(0, 3)) !== NaN){
					var http_status_code = parseInt(routes[i].slice(0, 3));
					var redirect_link = parseInt(routes[i].slice(4));

					res.redirect(http_status_code, redirect_link);
				}else{
					res.redirect(routes[i]);
				}
			}else if(typeof routes[i] == "number"){
				res.status(routes[i]);
			}else if(typeof routes[i] == "function"){
				if(next2){
					routes[i](err,req,res,next);
				}else{
					routes[i](req,res,next);
				}
				do_next = false;
			}else{
				//just next
			}
			break;
		}
	}
	if(do_next) next(err);
}
var path = require("path");
var url = require("url");

function removeModule(module_name, includeSubmodule=false){
	module_name = require.resolve(module_name);
	if(typeof require.cache[module_name] == "object"){
		if(includeSubmodule) if(typeof require.cache[module_name].children == "object") 
			if(require.cache[module_name].children.constructor == Array){
				for(var i=0;i<require.cache[module_name].children.length;i++){
					removeModule(require.cache[module_name].children[i].id, true);
				}
			};
		delete require.cache[module_name];
		return true;
	}
	return false
}
function sendFile(filepath, opts){
	return function(req, res, next){
		var urlParse = url.parse(req.originalUrl);
		// var urlParse2 = url.parse(`/${path.basename(filepath)}${urlParse.pathname.length > 1 && urlParse.pathname.substr(-1, 1) == "/" ? "/" : ""}${urlParse.search || ""}`);
		var urlParse2 = url.parse(`/${path.basename(filepath)}${urlParse.search || ""}`);
        var nReq = Object.assign({}, req, {url: urlParse2.href, path: urlParse2.pathname, originalUrl: urlParse2.href, _parsedUrl: urlParse2});
		require("serve-static")(path.dirname(filepath), opts)(nReq, res, next);
	}
}
function sendDirectory(dirpath, opts){
	return function(req, res, next){
		var urlParse = url.parse(req.originalUrl);
        // var urlParse2 = req.path == "/" ? url.parse("/") : url.parse(`./${path.basename(req.dirpath)}${urlParse.pathname.length > 1 && urlParse.pathname.substr(-1, 1) == "/" ? "/" : ""}${urlParse.search || ""}`);
        // var urlParse2 = req.path == "/" ? url.parse("/") : url.parse(`./${path.basename(req.dirpath)}${urlParse.search || ""}`);
        var urlParse2 = req.path == "/" ? url.parse("/") : url.parse(`./${urlParse.search || ""}`);
        var nReq = Object.assign({}, req, {url: urlParse2.href, path: urlParse2.pathname, originalUrl: urlParse2.href, _parsedUrl: urlParse2});
		require("serve-index")(dirpath, opts)(nReq, res, next);
	}
}

module.exports = {
	removeModule,
	sendFile,
	sendDirectory
}
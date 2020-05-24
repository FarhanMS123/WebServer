/** 
 * This plugins would read the req.path.
 * And then get file information to be handler.
 * The handler path will be put in req.realpath.
 */

//Modules Required
var url=require("url");
var path=require("path");
var fs=require("fs");

module.exports = function(req,res,next) {
	//Base Script
	var do_next = true;
    
    //Main Script
	var fullpath = path.resolve(path.join(req.app.get("config").web_folder, decodeURI(path.join(req.path))));
	
	if(fs.existsSync(fullpath)){
		var pathstat = fs.statSync(fullpath);
		if(pathstat.isDirectory()){
			var urlParse = url.parse(req.originalUrl);
			if(Boolean(req.app.get("config").addSlashOnDirectory) && urlParse.pathname.substr(-1,1) != "/"){
				res.redirect(urlParse.pathname + "/" + (urlParse.search ? urlParse.search : ""));
			}
			var ifl = req.app.get("config").index_file;
			var rds = fs.readdirSync(fullpath);
			var done=false;
			for(var i=0; i<ifl.length; i++){
				for(var j=0; j<rds.length; j++){
					if(ifl[i] == rds[j]){
						fullpath = path.join(fullpath, ifl[i]);
						done=true;
						break;
					}
				}
				if(done) break;
			}
		}
		req.filepath = fullpath;
	}else{
		res.status(404);
	}

	if(do_next) next();
}
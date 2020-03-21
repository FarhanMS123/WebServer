/** 
 * This plugins would read the req.path.
 * And then get file information to be handler.
 * The handler path will be put in req.realpath.
 */
module.exports = function(req,res,next) {
	//OnErr Request Handler
	var err = undefined, do_next = true;
	if(arguments[3]){
		err = req;
		req = res;
		res = next;
		next = arguments[3]; // if(do_next) next(err);
	}

    //Standard Module
	var url=require("url");
	var path=require("path");
    var fs=require("fs");
    
    //Main Declaration
	var fullpath = path.resolve(path.join(req.app.get("config").web_folder, path.join(req.path)));
	
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
		req.filepath = fullpath;
		res.status(404);
	}

	if(do_next) next(err);
}
/** 
 * This plugins would read the req.path.
 * And then get file information to be handler.
 * The handler path will be put in req.realpath
 */
module.exports = function(req,res,next) {
	//Check fullpath status
	if(typeof req.fullpath !== "undefined"){
		return next();
	}

    //Standard Module
	var url=require("url");
	var path=require("path");
    var fs=require("fs");
    
    //Main Declaration
	var fullpath = path.resolve(path.join(s_exp.get("config").web_folder, req.path));
	/*if(RegExp(`^${path.join(s_exp.get("config").web_folder, "tmp")}`).test(fullpath)){ 
        res.status(403);
    }*/
	
	if(fs.existsSync(fullpath)){
		var pathstat = fs.statSync(fullpath);
		if(pathstat.isDirectory()){
			var ifl = s_exp.get("config").index_file;
			var rds = fs.readdirSync(fullpath);
			var done=false;
			for(var i=0; i<ifl.length; i++){
				for(var j=0; j<rds.length; j++){
					if(ifl[i] == rds[j]){
						fullpath = path.join(fullpath, ifl[i]);
						req.realpath = fullpath;
						done=true;
						break;
					}
				}
				if(done) break;
			}
		}
	}else{
		res.status(404);
	}
}
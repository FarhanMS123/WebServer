/*
	htconfig.js
	
	Is a function to reroute file that exist or not.
*/

module.exports = function(req,res,next,type){
	//Standard Module
	var url=require("url");
	var path=require("path");
	
	//Main Module
	
	//Included Function
	
	//Main Declaration
	var fullpath = path.join(s_exp.get("web"), decodeURIComponent(type=="ws" ? url.parse(req.url).pathname : req.path));
	if(RegExp(`^${path.join(s_exp.get("web"), "tmp")}`).test(fullpath)) fullpath = path.join(s_exp.get("web"), "error/404.njs");
	
	if(fs.existsSync(fullpath)){
		var pathstat = fs.statSync(fullpath);
		if(pathstat.isDirectory()){
			var ifl = s_exp.get("index_file");
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
	}else{
		fullpath = path.join(s_exp.get("web"), "error/404.njs");
	}
	
	if(fullpath.toLowerCase().slice(0, path.resolve("./web/tmp").length) == path.resolve("./web/tmp").toLowerCase()){
		fullpath = path.join(s_exp.get("web"), "error/403.njs")
	}
	
	return fullpath;
}
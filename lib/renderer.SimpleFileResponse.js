module.exports = function(req,res,next){
	//Base Script
	if(res.finished) return next();

	//Main Script
	var fs = require("fs");
	var mimeTypes = require("mime-types");

	//Main Declaration
	var filepath = req.renderer ? req.renderer : req.filepath;
	if(!fs.existsSync(filepath)) return next();
	
	//res.set("Content-Type", mimeTypes.lookup(filepath));
	res.type(filepath);

	res.send(fs.readFileSync(filepath));
	//res.sendFile(filepath);

	res.next_router();
}
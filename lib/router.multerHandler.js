// https://github.com/expressjs/multer
// https://github.com/expressjs/multer/blob/master/StorageEngine.md

module.exports = function(req,res,next){
	var path = require("path");
	var multer = require("multer");

	var upload = multer({
		dest: path.resolve(req.app.get("config").tmp_folder)
	});
	
	return multer.any(req,res,next);
}
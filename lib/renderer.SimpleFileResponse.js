module.exports = function(req,res,next){
	//OnErr Request Handler
	var err = undefined, do_next = true;
	if(arguments[3]){
		err = req;
		req = res;
		res = next;
		next = arguments[3];
	}
	// if(do_next) next(err);
	//if(res.statusCode != 200){next(err); return;}
	if(res.finished){next(err); return;}

	//Module Imported
	var fs = require("fs");
	var mimeTypes = require("mime-types");

	//Main Declaration
	var filepath = req.renderer ? req.renderer : req.filepath;
	if(!fs.existsSync(filepath)){next(err); return;}
	
	//res.set("Content-Type", mimeTypes.lookup(filepath));
	res.type(filepath);

	res.send(fs.readFileSync(filepath));
	//res.sendFile(filepath);

	res.next_router(err);
}
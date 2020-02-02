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
	if(res.statusCode != 200){next(err); return;}
	if(res.statusCode != 200){next(err); return;}
	if(res.finished){next(err); return;}

	//Module Imported
	var fs = require("fs");
	var mimeTypes = require("mime-types");

	//Main Declaration
	if(!res.finished){ 
		//res.set("Content-Type", mimeTypes.lookup(req.realpath));
		res.type(req.realpath);

		res.send(fs.readFileSync(req.realpath));
		//res.sendFile(req.realpath);
	}

	if(do_next) next(err);
}
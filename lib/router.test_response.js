module.exports.start = function(req,res,next){
	req.start_time = new Date();
	console.log(`${req.method} ${req.url}`);
	console.log({req,res,next});
	next();
}
module.exports.end = function(req,res,next){
	var stop_time = new Date();
	var res_time = stop_time.getTime() - req.start_time.getTime();
	next();
	console.log(`${res.statusCode} ${req.url}`);
}
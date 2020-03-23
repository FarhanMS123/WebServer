var gap = "         ";
function labelTime(time){
	time = time.toString();
	time = time + "ms ";
	var addGap = (9 - time.length);
	time = (" ").repeat(addGap > 0 ? addGap : 1) + time;
	return time;
}

// " 10000ms " -> 1 + 5 + 2 + 1
module.exports.start = function(req,res,next){
	req.start_time = new Date();
	console.log(`${req.method}${gap}${req.url}`);
	next();
}
module.exports.end = function(req,res,next){
	var stop_time = new Date();
	var res_time = stop_time.getTime() - req.start_time.getTime();
	next();
	console.log(`${res.statusCode}${labelTime(res_time)}${req.url}`);
}
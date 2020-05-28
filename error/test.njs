module.exports = function(req,res,next){
	res.status(req.query.code ? req.query.code : 200);
	res.statusMessage = req.query.msg ? req.query.msg : res.statusMessage
	next();
}
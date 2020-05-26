module.exports = function(path, opts, cb){
	console.log(arguments);
	var req = opts.req, res = opts.res, next = opts.next;
	res.status(req.query.code ? req.query.code : 200);
	res.statusMessage = req.query.msg ? req.query.msg : res.statusMessage
	var errCode = req.query.errCode ? res.createError(parseInt(req.query.errCode)) : undefined;
	next(errCode);
	console.log([errCode]);
}
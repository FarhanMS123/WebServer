module.exports = function(ws,req){
	ws.on("message", function(data){
		ws.send(data);
	});
}
/*
	Title 	: Webserver V1.0.0
	Author	: FarhanMS123
	Version	: 1.0.0
	Date	: 2018/10/19
	Repos	: https://github.com/FarhanMS123/.
	Modules	: express, multer
	
	WebServer is an app to create a basic webserver based on expressjs.
	For begining you should configure the server from script below.
	It could server plain text only. If you want to make it more interactive, 
	you could code it in response.js file. htconfig.js is used for routing 
	file that doesn't exist or something different for it shouldn't.
	Use plugins.js to config and restructing the main app. plugins.js divided
	by 3 main functions : begin() function will execute after all module had
	required. middle() function will execute after express had set it variables.
	And last() function will execute after listen function had executed.
*/

//Use script below to setting web
global.listen = {
	host:"0.0.0.0",
	port:8080
};
global.web = "./web";
global.index_file = ["index.html"]

//Do not do anything below if you don't know the consequences
//Standard Module
var fs = require("fs");
var path = require("path");

//Main Module
global.exp = require("express");
global.plugins = require("./plugins.js");

//Included Function
global.removeModule = function(module_name, includeSubmodule=false){
	module_name = require.resolve(module_name);
	if(typeof require.cache[module_name] == "object"){
		if(includeSubmodule) if(typeof require.cache[module_name].children == "object") if(require.cache[module_name].children.constructor == Array){
			for(var i=0;i<require.cache[module_name].children.length;i++){
				global.removeModule(require.cache[module_name].children[i].id, true);
			}
		}
		delete require.cache[module_name];
		return true;
	}
	return false
}

//Main Declaration
global.s_exp = exp();
global.resp_func = require("./response.js");

plugins.begin();

if(!fs.existsSync(web)){
	throw new Error("Web folder not found");
	process.exit()
}

s_exp.set("listen", listen);
s_exp.set("web", path.resolve(web));
s_exp.set("index_file", index_file);

plugins.middle();

s_exp.all("/*", function(req,res,next){
	console.log(`Request <${req.method}> ${req.originalUrl}`);
	removeModule(require.resolve("./response.js"), true);
	global.resp_func = require("./response.js");
	if(typeof resp_func == "function"){
		resp_func.apply(null, arguments);
	}else{
		throw new Error("Respond should be Function");
	}
	next();
});

s_exp.set("applisten", s_exp.listen(listen));

plugins.last();
console.log("All plugins loaded")

console.log(`Webserver Active`);
console.log(listen);
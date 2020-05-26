function removeModule(module_name, includeSubmodule=false){
	module_name = require.resolve(module_name);
	if(typeof require.cache[module_name] == "object"){
		if(includeSubmodule) if(typeof require.cache[module_name].children == "object") 
			if(require.cache[module_name].children.constructor == Array){
				for(var i=0;i<require.cache[module_name].children.length;i++){
					removeModule(require.cache[module_name].children[i].id, true);
				}
			};
		delete require.cache[module_name];
		return true;
	}
	return false
}

module.exports = {
	removeModule
}
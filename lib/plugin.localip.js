module.exports = function(main, main_process, config){
	var os = require("os");
	var ifaces = os.networkInterfaces();

	config.ip_addresses = { "host":config.host };

	Object.keys(ifaces).forEach(function (ifname) {
		var alias = 0;

		ifaces[ifname].forEach(function (iface) {
			if (iface.family == "IPv4") {
				if (alias == 0) {
					config.ip_addresses[ifname] = iface.address;
				} else {
					if(typeof config.ip_addresses.constructor != "string"){
						var tmp = config.ip_addresses[ifname];
						config.ip_addresses[ifname] = [tmp];
					}

					config.ip_addresses[ifname].push(iface.address);
				}
			}else{
				alias--;
			}

			alias++;
		});
	});
}
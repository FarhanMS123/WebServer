// Property that often used
req.url
res.finished
req.app
req.app.get("config")
res.status(code)
res.statusCode
res.sendStatus
req.path

// Property that setted by main.js
global.config;
process.on("configurated", function(config){});
global.fs
global.path
global.express
process.on("modulesImported", function(fs, path, express){});
global.middleware_next;
global.removeModule;
global.app
process.on("serverCreated", function(app){});
app.on("serverCreated", function(app){});
app.get("config");
app.on("configSetted", function(config){});
app.on("settingMiddlewares", function(app){});
app.on("middlewaresSetted", function(app){});
app.get("listen");
app.on("appListening", function(listen){});

// Property that setted by plugin.localip.js
config
config.ip_addresses
config.ip_addresses.host

// Property that setted by router.renderer.js
res.renderTo(filename, config={}, callback=function(err){});
res._next_router
res.next_router(err);
req.renderer_config
req.renderer_config.err
req.renderer_config.req
req.renderer_config.res
req.renderer_config.next
req.renderer_config.config
req.renderer_list
req.renderer
config.renderer
app.rendererRouter(req,res,next)
app.renderTo(filename, config={})(req,res,next)
renderer.router(req, res, next);
renderer.renderTo(filename, config={})(req,res,next)
renderer.router_res_renderTo(req, res, next);

// Property that setted by plugin.WSHandler.js
ws.req
req.ws
req.main
req.main_process
req.config
req.filepath
req.app
req.app.get("listen")

// Property that setted by router.filepath.js
req.filepath

// Property that setted by router.HTTPStatusHandler.js
req.renderer_config.status_code
req.renderer_config.webpath
req.renderer_config.filepath
config.http_error

// Property that setted by renderer.DirectoryPageRenderer.js
req.renderer_config.dirpath
req.renderer_config.dirlist
req.renderer_config.webpath

// Property that setted by renderer.EJSRenderer.js
req.renderer_config.require
req.renderer_config.main_global
req.renderer_config.ejs_opt
req.renderer_config.ejs(filename, data, opts, callback)
req.renderer_config.experimental_include(filename, data, opts, callback)
req.renderer_config.includeSync(filename, data, opts)
req.renderer_config.includeAsync(filename, data, opts)
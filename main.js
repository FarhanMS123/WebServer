/**
 * WebServer v3.0.0
 * by FarhanMS123
 * using express
 * 
 * native modules : ["path", "url"]
 * node_modules : ["express", "express-truepath", "express-reroutes", "serve-index", "morgan", 
 *                 "http-errors", "express-ws", "consolidate", "ejs", "http-proxy"]
 * local modules : ["./library.js", "./router/middleware.PostHandler.js"]
 * 
 * This is an http server using and extends from express app. The modules included in
 * this app is most uses by many developper and recommended modules from express. I also 
 * use `app.engine` to support new extensions. It also support request over https proxy.
 * This app also could be act as proxy server and pass request to another server. This 
 * could help you if you have another server to process data. If you activate this in
 * settings, it would disable file response built-in modules. You should modify script
 * below to reenable it manually.
 * 
 * This app uses express-truepath to get the file path in system by url requested. It would
 * set `req.filepath` and `req.dirpath` if it is a file. Otherwise, it will set `req.dirpath` if
 * it is a directory. This app also uses express-reroutes to redirect to some url or reroute
 * filepath and/or directory that will be used by this app. This feature could help you in
 * setting your own router.
 * 
 * This app supports static serving, rendering, and indexing. It uses serve-static and serve-
 * index. serve-static and serve-index always follow `req.filepath` and `req.dirpath` propertise.
 * Also, it uses express engine to render some file. The data inside, will automatically filled
 * with `{app, req, res, views, render_opts, render_cb}`, only works via `res.render`. Notice that
 * `next` function is not included, you should set it by your self by add `{next}` in render data.
 * By default, we set `{next}` in every router we declare below. It also included `{_locals, settings}` 
 * which is generated by express it self. And in some engine, we add some features to give more control 
 * in app.
 * 
 * There are some extensions and engines supported, such as ejs, aejs, njs, and ws. EJS is embedded
 * javascript. It would generate HTML markup with plain JavaScript. The data will be filled with
 * opts from renderer. I also added some propertise, these are {cb, engine_path, require, opts}.
 * There are two extensions, these are *.ejs, and *.aejs. *.ejs will render synchronous template.
 * *.aejs will render asynchronous template. Because of *.ejs is synchronous and cannot wait, I 
 * added a POST Handler feature for it. For *.aejs, you should handle it by your self.
 * 
 * There is a new engine I build. It is `*.njs`, stands for nodejs. It just a normal
 * node module, but I set it to be view engine for this app. It should exports a function with 3 
 * arguments, those are `function(engine_path, opts, cb){}`. You have 2 options to response to
 * client. You could render it with html with callback from `cb(err, html);`, or you could
 * response it manually via `opts.res.send(html);`. This file also support routing. You access
 * it to sub routes of this file. For example, you could access this to web browser :
 * `http://localhost/test/api.njs/myname/human`
 * It will automatically reroute req.filepath to `./web/test/api.njs`
 * 
 * This app also support websocket. You just do it as same as you did to request a file in browser
 * except, you request it from websocket client using `ws://` proxy. The `*.ws` it self is normal node
 * module, It should exports a function with 2 arguments, those are `function(ws, req){}`. I set some
 * propertise, those are `ws.req`, `req.ws`, and `req.app`. If you call this with http, it would return
 * 406 Not Acceptable.
 * 
 * This app would handle http error via `res.status(http_error)` or `next(err)`. For descripting error, 
 * it uses http-errors module. It is defined as `createError` and included in `res.createError`. To 
 * response an error with http-errors, just do `next(req.createError(http_code));`, you could change 
 * http_code with http_code status or etc.
 * 
 * If you want to use http-proxy and activate it from settings, it would give app support to http proxy.
 * Every time all router didn't sent any response and giving back 404 code, it would automatically 
 * ignore error handler and pass request to another server. This feature would be great if you have another
 * server to handle the request (works fine with apache server). To do this, you should set `useHTTPProxy`
 * setting to true, and set the target. Also, don't forget to setting this app port and another server port.
 * NOTICE that if you enable it, this would (also) ignore this app's built-in file handler. You could enable 
 * it manually by removing the script 
 * 
 * req.filepath, req.dirpath, res.redirect(url), res.render(views, opts, cb)
 * res.locals, app.engine(ext, function(engine_path, opts, cb){})
 * next(err)
 * {app, req, res, views, render_opts, render_cb}
 * {next}
 * {_locals, settings}
 * {cb, engine_path, require, opts}
 * function(engine_path, opts, cb){}
 * cb(err, html);
 * opts.res.send(html);
 * function(ws, req){}
 * ws.req, req.ws, req.app
 * res.status(http_error), createError(), res.createError()
 * next(req.createError(http_code));
 * 
 * References :
 * https://expressjs.com/en/4x/api.html#router
 * https://www.npmjs.com/package/express-truepath
 * https://www.npmjs.com/package/express-reroutes
 * http://expressjs.com/en/4x/api.html#middleware-callback-function-examples
 * http://expressjs.com/en/guide/writing-middleware.html
 * http://expressjs.com/en/4x/api.html#res.render
 * http://expressjs.com/en/4x/api.html#app.engine
 * http://expressjs.com/en/advanced/developing-template-engines.html
 * http://expressjs.com/en/resources/template-engines.html
 * https://github.com/tj/consolidate.js
 * https://ejs.co/#docs
 * https://www.npmjs.com/package/express-ws
 * http://expressjs.com/en/resources/middleware/serve-static.html
 * http://expressjs.com/en/resources/middleware/serve-index.html
 * http://expressjs.com/en/resources/middleware/morgan.html
 * https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
 * https://www.npmjs.com/package/http-errors
 * https://www.npmjs.com/package/http-proxy
 */

var path = require("path");
var fs = require("fs");
var url = require("url");

var library = require("./library.js");
var express = require("express");
var logger = require('morgan');
var createError = require('http-errors');
var truePath = require("express-truepath");

var app = global.app = express();

// App configuration
app.set("app", app);
app.set("port", 80);
app.set("https", {
    passphrase: "20200413_WebServer_20200413_By_20200413_FarhanMS123_20200413",
    key: fs.readFileSync("./ssl/key.pem"),
    cert: fs.readFileSync("./ssl/cert.pem"),
    port: 443
});

app.set("useHTTPProxy", false);
app.set("http_proxy", {
    target: "http://localhost:8080"
});

app.set("web_folder", path.resolve("./web"));
app.set("index", ["index.html", "default.html", "index.ejs", "default.ejs", "index.aejs", "default.aejs", "index.njs", "default.njs"]);
app.set("follow_symlink", true);
app.set("resolveDirectoryURL", true);

app.set("reroutes", {
    "/*/*.njs/*": `FILE ${app.get("web_folder")}/{{ 0 }}/{{ 1 }}.njs`
});

app.set("index_opts", {});
app.set("static_opts", {
    etag: false
});

app.set("tmp_folder", path.resolve("./tmp"));
app.set("error_template", path.resolve("./web/error/default.ejs"))
app.set("router", path.resolve("./router"));

app.set("views", path.resolve("./views"));
app.disable("etag");

// App extension
var https_server = require("./ssl/index.js")(app.get("https"), app);

var http_proxy, http_proxy_server;
if(app.get("useHTTPProxy")){
    http_proxy = require("http-proxy");
    http_proxy_server = http_proxy.createProxyServer(app.get("http_proxy"));
}

var PostHandler =  require(path.resolve(global.app.get("router"), "middleware.PostHandler.js"));
var expressWs = require('express-ws')(app);

// App engine
var consolidate = require('consolidate'); // path, opts, cb
app.engine("ejs", (engine_path, opts, cb)=>{
    opts=Object.assign({cb, engine_path, require, opts}, opts); 
    var render = (err)=>{require("ejs").renderFile(engine_path, opts, Object.assign({async:false}, opts), cb)}
    if(opts.req && opts.res){
        PostHandler(opts.req, opts.res, render);
    }else{
        render();
    }
});
app.engine("aejs", (engine_path, opts, cb)=>{opts=Object.assign({cb, engine_path, require, opts}, opts); require("ejs").renderFile(engine_path, opts, Object.assign({async:true}, opts), cb);});
app.engine("njs", (engine_path, opts, cb)=>{library.removeModule(engine_path); require(engine_path)(engine_path, opts, cb);});
app.engine("ws", (engine_path, opts, cb)=>{opts.next(createError(406));});

// App routing
app.use(logger("dev"));
app.use(truePath(app.get("web_folder"), {
    index: app.get("index"), 
    follow_link: app.get("follow_symlink"),
    resolveDirectoryURL: app.get("resolveDirectoryURL")
}));
app.use(require("express-reroutes")(app.get("reroutes")));
app.use((req, res, next)=>{
    // register
    res.PostHandler = PostHandler;
    res.createError = createError;

    res._render = res.render;
    res.render = function(views, render_opts, render_cb){
        render_cb = typeof render_opts == "function" ? render_opts : render_cb;
        render_opts = typeof opts == "function" ? {} : render_opts;
        res._render(views, Object.assign({app, req, res, views, render_opts, render_cb}, render_opts), render_cb)
    }

    next();
});

/**
 * add your routers here.
 * you could remove this comment if you want.
 */

app.ws("/*.ws", function(ws, req){
    ws.req = req; req.ws = ws; req.app = app;

    var urlParse = url.parse(req.originalUrl);
    var urlParse2 = url.parse(path.dirname(urlParse.pathname) + (urlParse.search || ""));
    req.url = urlParse2.href; req.path = urlParse2.pathname; req.originalUrl = urlParse2.href; req._parsedUrl = urlParse2;

    var truepath = truePath.getTruePath(app.get("web_folder"), url.parse(req.url).pathname, {index:["index.ws"]});
    req.filepath = truepath.filepath; req.dirpath = truepath.dirpath;
    if(truepath && truepath.filepath){
        if(truepath.stat.isFile()){
            library.removeModule(req.filepath);
            require(req.filepath)(ws, req);
        }else{
            //ws.send("Error 406 : Not Acceptable");
            ws.close();
        }
    }else{
        //ws.send("Error 404 : Not found");
        ws.close();
    }
});
app.all("/*", function(req,res,next){
    var urlParse = url.parse(req.originalUrl);
    if(req.filepath && fs.existsSync(req.filepath) && app.engines[path.extname(req.filepath)]){
        res.render(req.filepath, {next}, function(err, html){
            if(html) res.send(html);
            if(err) next(err);
        });
    }else if(app.get("useHTTPProxy")){
        res.status(404);
        next(createError(404));
    }else if(req.filepath && fs.existsSync(req.filepath)){
        var urlParse2 = url.parse(`/${path.basename(req.filepath)}${urlParse.pathname.length > 1 && urlParse.pathname.substr(-1, 1) == "/" ? "/" : ""}${urlParse.search || ""}`);
        var nReq = Object.assign({}, req, {url: urlParse2.href, path: urlParse2.pathname, originalUrl: urlParse2.href, _parsedUrl: urlParse2});
        express.static(path.dirname(req.filepath), app.get("static_opts"))(nReq, res, next);
        console.log({urlParse2, nReq, dirname:path.dirname(req.filepath), filepath:req.filepath});
    }else if(req.dirpath && fs.existsSync(req.dirpath)){
        var dirpath = req.path == "/" ? req.dirpath : path.dirname(req.dirpath);
        var urlParse2 = req.path == "/" ? url.parse("/") : url.parse(`/${path.basename(req.dirpath)}${urlParse.pathname.length > 1 && urlParse.pathname.substr(-1, 1) == "/" ? "/" : ""}${urlParse.search || ""}`);
        var nReq = Object.assign({}, req, {url: urlParse2.href, path: urlParse2.pathname, originalUrl: urlParse2.href, _parsedUrl: urlParse2});
        require("serve-index")(dirpath, app.get("index_opts"))(nReq, res, next);
    }else{
        res.status(404);
        next(createError(404));
    }
});

app.use(function(req, res, next) {
    if((!res.sent || !res.writableEnded) && !app.get("useHTTPProxy") && res.statusCode != 404) res.render(app.get("error_template"), {next}, function (err, html) {
        if(html) res.send(html);
        if(err) next(err);
    });
}, function(err, req, res, next) {
    if((!res.sent || !res.writableEnded) && !app.get("useHTTPProxy") && res.statusCode != 404){
        res.locals.message = err.message;
        res.locals.error = err;
        
        res.status(err.status || 500);
        res.render(app.get("error_template"), {next, err}, function (err, html) {
            if(html) res.send(html);
            if(err) next(err);
        });
    }
});

app.all("/*", function(req, res, next){
    if((!res.sent || !res.writableEnded) && app.get("useHTTPProxy")) http_proxy_server.web(req, res);
    next();
});

// App listening
app.set("listen", app.listen(app.get("port")));
console.log(`Listening on ${app.get("port")}`);

module.exports = app;
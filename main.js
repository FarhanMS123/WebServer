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
 * Please read README.md before configurating this app.
 * 
 * --------------------------------------------------------------------------------------------
 * 
 * MIT License
 * 
 * Copyright (c) 2020 Farhan Muhammad Sabran
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 */

var path = require("path");
var fs = require("fs");
var url = require("url");

var library = require("./library.js");
var express = require("express");

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

app.set("web_folder", path.resolve("./web"));
app.set("truepath", {
    index: ["index.html", "default.html", "index.ejs", "default.ejs", "index.aejs", "default.aejs", "index.njs", "default.njs"], 
    follow_link: true,
    resolveDirectoryURL: true
});

app.set("index_opts", {});
app.set("static_opts", {
    etag: false
});

app.set("router", path.resolve("./router"));
app.set("views", path.resolve("./views"));
app.set("tmp_folder", path.resolve("./tmp"));

app.set("error_template", {
    default: path.resolve("./web/error/default.ejs")
});

app.disable("etag");

// App extensions
app.library = library

var https_server = require("./ssl/index.js")(app.get("https"), app);

var PostHandler =  require(path.resolve(global.app.get("router"), "middleware.PostHandler.js"));
app.PostHandler = PostHandler;

var createError = require('http-errors');
var truePath = require("express-truepath");

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

// App routing
app.use(require('morgan')("dev"));
app.use(truePath(app.get("web_folder"), app.get("truepath")));
app.use((req, res, next)=>{
    // registering functions for next handler
    res.PostHandler = PostHandler;
    res.createError = createError;

    var data = {app, req, res};
    for(key in data){
        res.locals[key] = data[key];
    }
    res._render = res.render;
    res.render = function(views, render_opts, render_cb){
        render_cb = typeof render_opts == "function" ? render_opts : render_cb;
        render_opts = typeof render_opts == "function" ? {} : render_opts;
        res._render(views, Object.assign({views, render_opts, render_cb}, render_opts), render_cb);
    }

    console.log({req, res});

    next();
});

/**
 * add your routers here.
 * you could rewrites rules or redirecting to another page.
 * you could remove this comment if you want.
 */

app.use("/*/*.njs/*", (req, res, next)=>{
    req.filepath = path.join(app.get("web_folder"), req.params[0], req.params[1] + ".njs");
    req.dirpath = path.dirname(req.filepath);
});

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
            // 406 Not Acceptable
            ws.close();
        }
    }else{
        // 404 Not found
        ws.close();
    }
});
app.all("/*", function(req,res,next){
    if(req.filepath && path.extname(req.filepath).toLowerCase() == ".ws"){
        res.status(406);
        next(createError(406));
    }else next();
});

/* // HTTP PROXY - Pass Request to next server
app.all("/*", function(req, res, next){
    if( (!res.sent || !res.writableEnded) && !(req.filepath && fs.existsSync(req.filepath) && app.engines[path.extname(req.filepath).toLowerCase()]) ) 
        require("http-proxy").createProxyServer({
            // this is an example to pass request to an apache server in the same host.
            // reminds to change server's port from 80 to 8080 () for http request and 443 to 8443 for https request.
            target: req.connection.encrypted ? "https://localhost:8443" : "http://localhost:8080"
        }).web(req, res);
    next();
}); */

// File Handler
app.all("/*", function(req,res,next){
    var urlParse = url.parse(req.originalUrl);
    if(res.sent || res.writableEnded){
        next();
    }else if(req.filepath && fs.existsSync(req.filepath) && app.engines[path.extname(req.filepath).toLowerCase()]){
        res.render(req.filepath, {next}, function(err, html){
            if(html) res.send(html);
            if(err) next(err);
        });

// serve-static
    }else if(req.filepath && fs.existsSync(req.filepath) && app.get("static_opts") && app.get("static_opts").constructor == Object){
        // res.sendFile(req.filepath);
        library.sendFile(req.filepath, app.get("static_opts"))(req, res, next);

// serve-index
    }else if(req.dirpath && fs.existsSync(req.dirpath) && app.get("index_opts") && app.get("index_opts").constructor == Object){
        // this feature is disabled due not correctly show path.
        // library.sendDirectory(req.dirpath, app.get("index_opts"))(req, res, next);

        // replaced for serve-index feature above
        require("serve-index")(app.get("web_folder"), app.get("index_opts"))(req, res, next);
    }else{
        res.status(404);
        next(createError(404));
    }
});

function errHandler(req, res, next, next2){ // req||err, res||req, next||res, next
    var err;
    if(next2){
        err = req; req = res; res = next; next = next2;

        res.err = err;
        res.locals.message = err.message;
        res.locals.error = err;
        res.status(err.status || 500);
    }

    if((!res.sent || !res.writableEnded)){
        var error_views = app.get("error_template");
        error_views = error_views[res.statusCode] || error_views["default"];
        res.render(error_views, {next, err}, function (err, html) {
            if(html) res.send(html);
            if(err) next(err);
        });
    }
}
app.use(function(req, res, next){ errHandler(req, res, next); }, function(err, req, res, next){ errHandler(err, res, res, next); });

// App listening
app.set("listen", app.listen(app.get("port")));
console.log(`Listening on ${app.get("port")}`);

module.exports = app;
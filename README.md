# WebServer

![WebServer](./web/WebServer%20Social%20Preview.png)

![status success](https://img.shields.io/badge/status-success-green)

This is an http server using and extends from express app. The modules included in this app is most uses by many developper and recommended modules from express. I also use `app.engine` to support new extensions. It also support request over https protocol. This app also could be act as proxy server and pass request to another server. This would help you if you have another server to process data. If you activate it in settings, it would disable built-in modules which is handle file response. You should modify script below to reenable it manually.

## Installation

Before begin, you need `git` and `NodeJS` installed in your system.

First, download this repository and extract it. Or you could using git to clone it.
```
$ git clone https://github.com/FarhanMS123/WebServer.git
$ cd WebServer
$ git checkout -b 3.0.0
```
Second, download modules needed by this app and start app
```
$ npm install
$ npm update
$ npm start
```

You would face problem while trying to start the script. If you meet the problem, you should setting your app in `main.js`. Read documentation below before begin, and ask an issue if you are confused.

## Documentation

- [x] App Configuration
    - [x] HTTP
    - [x] HTTPS
    - [x] Express setting
- [x] Proxy Server
- [x] express-filepath
- [x] createError
- [x] POST Handler
- [x] Routers and rewrites rules
- [x] Serve Static
- [x] Serve Index
- [x] APP Engine & Renderer
    - [x] EJS
    - [x] NJS
    - [x] WS
- [ ] Extra script
    - [ ] library
        - [ ] library.removeModule
        - [ ] library.sendFile
        - [ ] library.sendDirectory
    - [ ] morgan 

All settings are registered in express server app using `app.set()` method and you could get the value by `app.get()` method. Express also has some settings which you could set, enable, or disable it by method offer (check it in Express documentation). By default, http port is setted to `80` and have configurated the https certificate with port setted to `443`. However, many linux OSes are prohibit an unrooted app to listen under 1024. So, if you havne;t control over root permission, you should change the ports to above 1024. You could ignore `passphrase`, `key`, and `cert`. However, if you want to use your own certificate, don't forget to put the `key.pem` and `cert.pem` in this app's `ssl` folder and modify or remove `passphrase` propertise.

```javascript
app.set("port", 80); // FOR HTTP
app.set("https", {
    passphrase: "YOUR_SSL_PASSPHRASE",
    key: fs.readFileSync("./ssl/key.pem"),
    cert: fs.readFileSync("./ssl/cert.pem"),
    port: 443 // FOR HTTPS
});

app.disable("etag");
```

See also:
- [Making your own SSL by hackernoon](https://hackernoon.com/set-up-ssl-in-nodejs-and-express-using-openssl-f2529eab5bb)
- [Express application setting](http://expressjs.com/en/4x/api.html#app.settings.table)

You could use `http-proxy` to make this app act as a proxy server and pass request to another server. This feature would be used for **rewrites rules** feature. This feature is placed before file response feature and disabled by default. To activate it, uncomment the script. You could use this feature to make another server handle file request.

```javascript
// HTTP PROXY - Pass Request to next server
app.all("/*", function(req, res, next){
    if(!res.sent || !res.writableEnded) 
        require("http-proxy").createProxyServer({
            target: "http://localhost:8080"
        }).web(req, res);
    next();
});
```

See also :
- [`http-proxy` modules](https://www.npmjs.com/package/http-proxy)

This app has **App extensions** flag. It uses to put any library or functions needed by this app. `express-truepath` is the one of them to get the file path in system by url requested. It would set `req.filepath` and `req.dirpath` if it is a file. Otherwise, it will only set `req.dirpath` if it is a directory. It has some propertise that maybe need a little changes, otherwise you could leave it as default.

```javascript
app.set("web_folder", path.resolve("./web")); // web folder's path
app.set("truepath", {
    // index file that will be find instead serving directory list.
    index: ["index.html", "default.html", "index.ejs", "default.ejs", "index.aejs", "default.aejs", "index.njs", "default.njs"],  
    follow_link: true,
    resolveDirectoryURL: true
});

// example using router
app.all("/*", (req, res, next)=>{
    // it will return this property if it is exist
    req.filepath // only if it is a file
    req.dirpath // both if it is file or directory
});
```

See also :
- [How `express-truepath` works.](https://www.npmjs.com/package/express-truepath)

This app would handle http error via `res.status(http_error)` or `next(err)`. For descripting error, it uses `http-errors` module. It is defined as `createError(http_error)` and included in `res.createError(http_code)`. To  response an error with `http-errors`, just do `next(res.createError(http_code));`, you could change `http_code` with http status code or etc. In the end of router, it will render a error file using app engine. It would set `res.locals.message`, `res.locals.error`, `res.statusCode` and pass it to render engine. It has default error views, you can edit or change the view's filepath. You could add another views to handle any http code.

```javascript
app.set("error_template", {
    default: path.resolve("./web/error/default.ejs")
    //, 404: path.resolve("./web/error/404.html") // if you have your 404 file, copy, paste this script to main.js, and uncomment it.
});

// example using router
app.all("/*", (req, res, next)=>{
    // you could set status code first
    res.status(404);
    next();

    // or you could use createError
    next(res.createError(404));
});
```

See also :
- [HTTP Status Code](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes)
- [Create Error with `http-errors` module](https://www.npmjs.com/package/http-errors)

There is a built-in POST Handler ready to use. It would parse `application/json`, `application/octet-stream`, `text/plain`, `application/x-www-form-urlencoded`, and `multipart/form-data` and put the data in `req.body`. For files upload, it will save temporary to `tmp` directory and setted the files list to `req.files`. You need to set `tmp` directory, otherwise you could leave it as default.

```javascript
app.set("tmp_folder", path.resolve("./tmp"));

// you could call PostHandler via...
var PostHandler = require(path.resolve(global.app.get("router"), "middleware.PostHandler.js"));
app.PostHandler;
global.app.PostHandler; // in aejs, you could use `main_global` instead `global`
res.PostHandler

// example using express routes
app.all("/*", PostHandler, (req, res, next)=>{
    // process your post here.
});

// or you could use like this
app.all("/*", async (req, res, next)=>{
    await new Promise((resolve)=>PostHandler(req, res, resolve));

    // process your post here
});
```

> If you make your own POST Handler (especially upload handler), save the file(s) in the `tmp_folder` and make sure it would remove automatically. Files which is uploaded without rechecked could be dangerous and used as injector by attacker.

See also :
- [parsing form data with `body-parse` module](https://www.npmjs.com/package/body-parser)
- [process file upload with `multer` module](https://www.npmjs.com/package/multer)

You could handle and process request with express router. With router, you could write rules such as reroutes, redirect, or block request, making APIs, set filepath or dirpath, or handle POST request (include file upload). Also, you could render a page or send file with specific feature to users. All features above are created to support developper in building the app. 

```javascript
// Only present propertise and functions that introduced in app.

// these are some propertise which would you need.
app;
global.app;
app.get("port");
app.get("web_folder");
app.get("error_template")["default"];
app.get("router"); // path to router folder
                   // `router` is a folder to place bunch of router that
                   // would be used for this app, like routing feature or etc.
app.get("views"); // path to views folder. this would be used by express engine.
                  // From express documentation, `views` is " A directory or an 
                  // array of directories for the application's views. If an array, 
                  // the views are looked up in the order they occur in the array. "
                  // this will be explained in next part.
app.get("tmp_folder");

// these are some function that will help you.
// some function presented here maybe could only used in `main.js`
require("http-proxy");
res.createError;
truepath;
req.filepath;
req.dirpath;
PostHandler;
app.PostHandler;
global.app.PostHandler;
res.PostHandler;

// example of routers
// these examples aren't included in main.js
// so, these are basically examples.
app.get("/users/:user", (req, res, next)=>{
    if(req.params.user == "Budi"){
        req.filepath = path.join(app.get("web_folder"), "users.ejs");
    }else{
        next(res.createError(403));
    }
});
app.post("/upload", app.PostHandler, (req, res, next)=>{
    if(req.body.name == "Budi"){
        req.files.forEach((file)=>{
            fs.renameSync(file.path, path.join(app.get("web_folder"), file.originalname));
        });
        res.render("postUploader.aejs", {next}, (err, html)=>{
            res.send(html);
        });
    }else{
        req.files.forEach((file)=>{
            fs.unlinkSync(file.path);
        });
        next(res.createError(403));
    }
});
app.all("/apis/*", (req, res, next)=>{
    if(!req.filepath || !req.dirpath){
        require("http-proxy").createProxyServer({
            target: "http://localhost:8080"
        }).web(req, res);
    }else{
        next();
    }
});
app.all("/apis/v2/*", require(path.join(app.get("web_folder"), "apis.v2.js")));
```

> read express documentation for more functions that would you need.

See also :
- [How `express-truepath` works.](https://www.npmjs.com/package/express-truepath)
- [Express Router](https://expressjs.com/en/4x/api.html#router)
- [Middleware callback function examples](http://expressjs.com/en/4x/api.html#middleware-callback-function-examples)
- [Writing middleware for use in Express apps](http://expressjs.com/en/guide/writing-middleware.html)

This app is using `serve-static` and `serve-index` to handle file request and render folder listing. These would follow filepath from `req.filepath` in **File Handler** router and have implemented in library as `sendFile` and `sendDirectory`. Unfortunately, `sendDirectory` is disabled due wrong in showing directory's path in page. It has replaced with **serve-static** router which is next from File Handler router and not following `req.dirpath` propertise. Settings is available to control `serve-static` and `serve-index`.

```javascript
app.set("index_opts", {});
app.set("static_opts", {
    etag: false
});
```

See also :
- [Serve static files with `serve-static`](http://expressjs.com/en/resources/middleware/serve-static.html)
- [Render directory listings using `serve-index`](http://expressjs.com/en/resources/middleware/serve-index.html)

Express has render engine feature to render views. You also could add data to renderer to make it really dynamic. The data inside will automatically filled with `{app, req, res, views, render_opts, render_cb}`, only works via `res.render`. Notice that `next` function is not included, you should set it by your self by add `{next}` in render data. By default, we set `{next}` in every built-in routers we have declared. It also included `{_locals, settings}`  which is generated by express it self. And in some engine, we add some features to give more control in app.

> Use `res.render` instead of `app.render`. 

```javascript
app.engine("extension", function(filepath, data, cb){
    data = {
        _locals, settings, // setted by express
        app, req, res, views, render_opts, render_cb, // defined by this app
        next, ...other data by render, ...other data by locals // defined by yourself
    };
    cb(undefined, 
    `<pre>${data.date.toString()}\nNo timeline from ${data.label} right now.</pre>
    <br />
    <b>Theme type : ${data.type}</b>`);
});

app.get("/timeline", (req, res, next)=>{
    res.locals.date = new Date();
    res.locals.label = "My Office";

    res.render("index.extension", {next, type:"default"}, function(err, html){
        res.send(html);
    });
});
```
See also :
- [Using template engines](https://expressjs.com/en/guide/using-template-engines.html)
- [Developing template engines for express](https://expressjs.com/en/advanced/developing-template-engines.html)
- [Template engines](https://expressjs.com/en/resources/template-engines.html)
- [Working with `consolidate.js`](https://github.com/tj/consolidate.js)
- [Express API `res.render`](http://expressjs.com/en/4x/api.html#res.render)
- [Express API `app.engine`](http://expressjs.com/en/4x/api.html#app.engine)

There are some extensions and engines supported, such as ejs, aejs, njs, and ws. EJS is embedded javascript. It would generate HTML markup with plain JavaScript. The data will be filled with opts from renderer. I also added some propertise, these are `{cb, engine_path, require, opts}`. There are two extensions, these are `*.ejs`, and `*.aejs`. `*.ejs` will render synchronous template. `*.aejs` will render asynchronous template. Because of `*.ejs` is synchronous and cannot wait, I  added a POST Handler feature for it. For `*.aejs`, you should handle it by your self.

```html
<%
    // some variables available for *.ejs
    _locals, settings, // setted by express
    app, req, res, views, render_opts, render_cb, // defined by this app via res.render
    cb, engine_path, require, opts // defined by this app via engine
    next, ...other data by render, ...other data by locals // defined by yourself
%>
```

This is an example of synchronize ejs via `*.ejs` file type
```html
<%
    // Synchronize ejs support post handler.
    // So you could handle the POST via res.
    // Please remind! Always use sync function or you couldn't present the data to users.
    res.body
    res.files

    name = req.query["name"] || "world";
%>
Hello, <%- name %>!
<%- include("./footer.ejs", {date: new Date()}) %>
```

This is an example of asynchronize ejs via `*.aejs` file type.
```html
<%
    // Asynchronize ejs didn't support post handler automatically, so you should import it by your self
    var path = require("path");
    var POSTHandler = require(path.resolve(app.get("router"), "middleware.PostHandler.js"));
    
    // await function could make script to pause until Promise resolved
    await new Promise((resolved, rej)=>{ POSTHandler(req, res, resolved) });

    // now you could process it with sync or async functions.
    res.body
    res.files

    name = req.query["name"] || "world";
%>
Hello, <%- name %>!

<% /* Notice that `include` need `await` in async ejs */ %>
<%- await include("./footer.ejs", {date: new Date()}) %>
```

> Every files uploaded will be saved temporary in `tmp` folder

See also :
- [EJS Docs](https://ejs.co/#docs)
- [Handle multipart boundary POST with `multer`](http://expressjs.com/en/resources/middleware/multer.html)
- [Handle POST with `body-parse`](http://expressjs.com/en/resources/middleware/body-parser.html)

There is a new engine introduced. It is `*.njs`, stands for nodejs. It just a normal node module modified to be view engine in this app. It should exports a function with 3 arguments, those are `function(engine_path, opts, cb){}`. You have two ways to response to client. You could render it with html via callback from `cb(err, html);`, or you could response it manually via `opts.res.send(html);`. This file also support routing. You could access it to sub routes of this file. For example, you could access this from web browser : `http://localhost/test/api.njs/myname/human` It will automatically reroute req.filepath to `./web/test/api.njs`

This is an example code for `*.njs`.
```javascript
module.exports = function(engine_path, opts, cb){
    // Using req and res to response
    var req = opts.req, 
        res = opts.res;

    res.send("<h1>Hello world!</h1>");

    // or using `cb(err, html)` to response
    cb(undefined, "<h1>Hello world!</h1>");
}
```

This app also support websocket. You would did it as same as you did to request a file in browser, except you have request it from websocket client using `ws://` proxy. The `*.ws` it self is normal node module, It should exports a function with 2 arguments, those are `function(ws, req){}`. I set some propertise, those are `ws.req`, `req.ws`, and `req.app`. If you call this with http, it would return `406 Not Acceptable`.

Example of `echo.ws`
```javascript
module.exports = function(ws, req){
	ws.on("message", function(data){
		ws.send(data);
	});
}
```

See also :
- [Using websocket in express using `express-ws`](https://www.npmjs.com/package/express-ws)
- [Handle websocket connection documentation](https://github.com/websockets/ws/blob/HEAD/doc/ws.md#event-connection)

# HAVEN'T HAVE REFERENCES
http://expressjs.com/en/resources/middleware/morgan.html

## LICENSE

MIT License

Copyright (c) 2020 Farhan Muhammad Sabran

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
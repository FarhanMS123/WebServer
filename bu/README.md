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

All settings are registered in express server app using `app.set()` method. This would be easier to use express standard which is supported (and recommended) by express and many developpers out there. By default, http port is setted to `80` and have configurated the https certificate with port setted to `443`. However, many linux OSes are prohibit an unrooted app to listen under 1024. So for this step, you should change the ports to above 1024. You could ignore `passphrase`, `key`, and `cert`.   But, if you want to use your own certificate, don't forget to put the `key.pem` and `cert.pem` in this app's `ssl` folder and modify or remove `passphrase` propertise.

```javascript
app.set("port", 80); // FOR HTTP
app.set("https", {
    passphrase: "YOUR_SSL_PASSPHRASE",
    key: fs.readFileSync("./ssl/key.pem"),
    cert: fs.readFileSync("./ssl/cert.pem"),
    port: 443 // FOR HTTPS
});
```

See also:
- [Making your own SSL by hackernoon](https://hackernoon.com/set-up-ssl-in-nodejs-and-express-using-openssl-f2529eab5bb)

This app uses `express-truepath` to get the file path in system by url requested. It would set `req.filepath` and `req.dirpath` if it is a file. Otherwise, it will set `req.dirpath` if it is a directory. It has some propertise that maybe need a little changes, otherwise you could leave it as default.

```javascript
app.set("web_folder", path.resolve("./web")); // web folder's path
app.set("index", ["index.html", "default.html", "index.ejs", "default.ejs", "index.aejs", "default.aejs", "index.njs", "default.njs"]); // index file that will be find instead serving directory list. 
app.set("follow_symlink", true); // 
app.set("resolveDirectoryURL", true); 
```

This app also uses `express-reroutes` to redirect to some url or reroute filepath and/or directory that will be used by this app. There also has some spaces to write rules or add your own router which you could change the `req.filepath` and `req.dirpath`, process request, and pass for next router to rendering it.

```javascript
/**
 * add your routers here.
 * you could rewrites rules or redirecting to another page.
 * you could remove this comment if you want.
 */

...

app.get("/users/:username/:directory", function(req, res, next){
    req.filepath = path.resolve("./web", "user.ejs");
    req.dirpath = path.dirname(req.filepath);
    next();
});

...
```

<!-- Script above could be done with `express-reroutes` by adding new rule to the `reroutes` setting.

```javascript
app.set("reroutes", {
    ...
    "/users/:username/:directory":"FILE ./web/user.ejs"
});
``` -->

See also :
- [How `express-truepath` works.](https://www.npmjs.com/package/express-truepath)
- [Writing rules with `express-reroutes`.](https://www.npmjs.com/package/express-reroutes)
- [Express Router](https://expressjs.com/en/4x/api.html#router)
- [Middleware callback function examples](http://expressjs.com/en/4x/api.html#middleware-callback-function-examples)
- [Writing middleware for use in Express apps](http://expressjs.com/en/guide/writing-middleware.html)

This app supports static serving, rendering, and indexing. It uses `serve-static` and `serve-index`. Those has been set to always follow `req.filepath` and `req.dirpath` propertise. There are some settings to change their behavior. Otherwise, you could leave it as default.

```javascript
app.set("index_opts", {});
app.set("static_opts", {
    etag: false
});
app.disable("etag");
```

Also, it uses express engine to render template file. The data inside, will automatically filled with `{app, req, res, views, render_opts, render_cb}`, only works via `res.render`. Notice that `next` function is not included, you should set it by your self by add `{next}` in render data. By default, we set `{next}` in every built-in routers we have declared. It also included `{_locals, settings}`  which is generated by express it self. And in some engine, we add some features to give more control in app.

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

This app would handle http error via `res.status(http_error)` or `next(err)`. For descripting error, it uses http-errors module. It is defined as `createError` and included in `res.createError`. To  response an error with http-errors, just do `next(res.createError(http_code));`, you could change  http_code with http_code status or etc. 

If you want to use http-proxy and activate it from settings, it would give app support to http proxy. Every time all router didn't sent any response and giving back 404 code, it would automatically  ignore error handler and pass request to another server. This feature would be great if you have another server to handle the request (works fine with apache server). To do this, you should set `useHTTPProxy` setting to true, and set the target. Also, don't forget to setting this app port and another server port. NOTICE that if you enable it, this would (also) ignore this app's built-in file handler. You could enable it manually by removing the script 

## Data opts (ignore this)
```javascript
req.filepath, req.dirpath, res.redirect(url), res.render(views, opts, cb)
res.locals, app.engine(ext, function(engine_path, opts, cb){})
next(err)
{app, req, res, views, render_opts, render_cb}
{next}
{_locals, settings}
{cb, engine_path, require, opts}
function(engine_path, opts, cb){}
cb(err, html);
opts.res.send(html);
function(ws, req){}
ws.req, req.ws, req.app
res.status(http_error), createError(), res.createError()
next(req.createError(http_code));
```

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

## References
https://hackernoon.com/set-up-ssl-in-nodejs-and-express-using-openssl-f2529eab5bb
https://expressjs.com/en/4x/api.html#router
https://www.npmjs.com/package/express-truepath
https://www.npmjs.com/package/express-reroutes
http://expressjs.com/en/4x/api.html#middleware-callback-function-examples
http://expressjs.com/en/guide/writing-middleware.html
http://expressjs.com/en/4x/api.html#res.render
http://expressjs.com/en/4x/api.html#app.engine
http://expressjs.com/en/advanced/developing-template-engines.html
http://expressjs.com/en/resources/template-engines.html
https://github.com/tj/consolidate.js
https://ejs.co/#docs
https://www.npmjs.com/package/express-ws
http://expressjs.com/en/resources/middleware/serve-static.html
http://expressjs.com/en/resources/middleware/serve-index.html
http://expressjs.com/en/resources/middleware/morgan.html
https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
https://www.npmjs.com/package/http-errors
https://www.npmjs.com/package/http-proxy
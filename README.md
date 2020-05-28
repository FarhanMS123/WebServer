# WebServer

![WebServer](./web/WebServer%20Social%20Preview.png)

![status success](https://img.shields.io/badge/status-success-green)

This is an http server using and extends from express app. The modules included in this app is most uses by many developper and recommended modules from express. I also use `app.engine` to support new extensions. It also support request over https proxy. This app also could be act as proxy server and pass request to another server. This could help you if you have another server to process data. If you activate this in settings, it would disable file response built-in modules. You should modify script below to reenable it manually.

## Installation

Before begin, you need `git` and `NodeJS` installing in your system.

First, download this repository and extract it. Or you could using git to clone it.
```
> git clone https://github.com/FarhanMS123/WebServer.git
> git checkout -b 3.0.0
```
Second, download modules needed by this app and start app
```
> npm install
> npm start
```
You could face problem while trying to start the script. If you meet the problem, you should setting your app in `main.js`. Ask an issue if you are confused.

## Documentation
> This documentation could be found in the begining of `main.js`.

This app uses `express-truepath` to get the file path in system by url requested. It would set `req.filepath` and `req.dirpath` if it is a file. Otherwise, it will set `req.dirpath` if it is a directory. This app also uses `express-reroutes` to redirect to some url or reroute filepath and/or directory that will be used by this app. This feature could help you in setting your own router.

This app supports static serving, rendering, and indexing. It uses serve-static and serve- index. serve-static and serve-index always follow `req.filepath` and `req.dirpath` propertise. Also, it uses express engine to render some file. The data inside, will automatically filled with `{app, req, res, views, render_opts, render_cb}`, only works via `res.render`. Notice that `next` function is not included, you should set it by your self by add `{next}` in render data. By default, we set `{next}` in every router we declare below. It also included `{_locals, settings}`  which is generated by express it self. And in some engine, we add some features to give more control  in app.

There are some extensions and engines supported, such as ejs, aejs, njs, and ws. EJS is embedded javascript. It would generate HTML markup with plain JavaScript. The data will be filled with opts from renderer. I also added some propertise, these are {cb, engine_path, require, opts}. There are two extensions, these are `*.ejs`, and `*.aejs`. `*.ejs` will render synchronous template. `*.aejs` will render asynchronous template. Because of `*.ejs` is synchronous and cannot wait, I  added a POST Handler feature for it. For `*.aejs`, you should handle it by your self.

There is a new engine I build. It is `*.njs`, stands for nodejs. It just a normal node module, but I set it to be view engine for this app. It should exports a function with 3  arguments, those are `function(engine_path, opts, cb){}`. You have 2 options to response to client. You could render it with html with callback from `cb(err, html);`, or you could response it manually via `opts.res.send(html);`. This file also support routing. You access it to sub routes of this file. For example, you could access this to web browser : `http://localhost/test/api.njs/myname/human` It will automatically reroute req.filepath to `./web/test/api.njs`

This app also support websocket. You just do it as same as you did to request a file in browser except, you request it from websocket client using `ws://` proxy. The `*.ws` it self is normal node module, It should exports a function with 2 arguments, those are `function(ws, req){}`. I set some propertise, those are `ws.req`, `req.ws`, and `req.app`. If you call this with http, it would return 406 Not Acceptable.

This app would handle http error via `res.status(http_error)` or `next(err)`. For descripting error, it uses http-errors module. It is defined as `createError` and included in `res.createError`. To  response an error with http-errors, just do `next(req.createError(http_code));`, you could change  http_code with http_code status or etc. 

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

## References
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
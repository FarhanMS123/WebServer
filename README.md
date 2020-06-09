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
- [ ] POST Handler
- [ ] Routers and rewrites rules
- [ ] Serve Static
- [ ] Serve Index
- [ ] APP Engine & Renderer
    - [ ] EJS
    - [ ] NJS
    - [ ] WS

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

This app has integrated with HTTP Proxy, so in the end of routers, if there are none response, it would pass the request to target server. By default is not active, so this app would handle all request by itself. To turning it on, you should uncomment it's setting. You could disable the `serve-index` and `serve-static` features to make target server handling the file response.

```javascript
app.set("http_proxy", {
    target: "http://localhost:8080"
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

This app would handle http error via `res.status(http_error)` or `next(err)`. For descripting error, it uses http-errors module. It is defined as `createError(http_error)` and included in `res.createError(http_code)`. To  response an error with http-errors, just do `next(res.createError(http_code));`, you could change `http_code` with http status code or etc. In the end of router, it will render a error file using app engine. It would set `res.locals.message`, `res.locals.error`, `res.statusCode` and pass it to render engine. It has default error views, you can edit or change the view's filepath. You could add another views to handle any http code.

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

There is a built-in POST Handler ready to use. It would parse `application/json`, `application/octet-stream`, `text/plain`, `application/x-www-form-urlencoded`, and `multipart/form-data` and put the data in `req.body`. For files upload, it will save temporary to `tmp` directory and setted to `req.files`. You need to set `tmp` directory, otherwise you could leave it as default.

```javascript
app.set("tmp_folder", path.resolve("./tmp"));

// example using express routes
app.all("/*", require(path.join(app.get("router"))) (req, res, next)=>{});
```

# HAVEN'T HAVE REFERENCES
http://expressjs.com/en/resources/middleware/serve-static.html
http://expressjs.com/en/resources/middleware/serve-index.html
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
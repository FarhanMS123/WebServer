# WebServer
WebServer in NodeJS with ExpressJS. This is a fork from https://github.com/FarhanMS123/WebServer . This project should be work with XAMPP. (Tested in Windows).

## Installation
To install this in GUI mode, you could do with :
1. Clone this repository and extract it in XAMPP folder or run `git clone https://github.com/FarhanMS123/WebServer-with-XAMPP.git` from bash in XAMPP folder.
2. Rename it as `nodejs`
3. Copy `start_nodejs.bat` to XAMPP folder
4. Run your XAMPP, Apache and execute `start_nodejs.bat` from XAMPP folder.
5. Move `error` to `htdocs` 
5. Open this nodejs server address instead apache server address (default is `http://localhost:8080/`)
6. Enjoy

## Configuration
- This app will forward to XAMPP via http protocol, you could cofigurate it from `config.js` at http_proxy_opts
- This app also uses HTTPS connection. It would have conflict with XAMPP. So turning it off would make it better. Open `apache/extra/httpd-ssl.conf` and change `Listen 443` to `# Listen 443` (add `#` to it).
- If you want to listen in `80`, you should modify apache httpd configuration in `apache/httpd.conf` and change from `Listen 80` to any port you want. For example, `Listen 8000`. After that, you should setting `config.js`, change the port to `80` and setting `http_proxy_opts.target` to `http://localhost:8000`

## Explain
Every request will be handle by this application. All routes that cannot be handled by renderer logic would be reroutes to apache server. There are some problems. Every error created by this application couldn't be handled by apache, instead it would handled by this http error renderer. After this application pass the request to apache, there aren't any chance to edit those back.

## Documentation & API
I haven't made any documentation yet. But... I left much comment in my script. hope you understand it :') <br />
Else... you could read it from `test` there are some examples to make you understand how to use this framework. <br />
Otherwise, there are `/references.js` for how much property that changes in each plugins, `/lib/lib.template.js` to making your plugin with your own self, `/config.js` to configure your server and etc.

Please be kind to helping me made a documentation. <br />
Thankyou ^_^
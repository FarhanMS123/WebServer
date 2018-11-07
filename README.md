# WebServer
A Full WebServer that could serve plain document, websocket, ejs, nhtml, and nodejs script. <br />
<br />
  This repository is a structural webserver application that created in NodeJS. It is support plain html or anytext, websocket, ejs, nhtml, and NodeJS(njs) File script. The WebServer is structed from index.js as main script, plugin.js that run first when the index.js execute, respond.js that respond when request coming in, and htconfig.js that run when respond.js request the true path of url and return the tru path from webserver. This WebServer is created for simpler use and build on expressjs. <br />
<br />
  Table of Contents :
  - Application Information
  - index.js configuration
    - configuring server for the first time
  - plugins.js configuration
    - Introducing library
    - begin function
    - middle function
      - Working with use function
    - last function
  - respond.js configuration
    - Reroute error
    - Add an extension
    - Working with type
  - htconfig.js configuration
    - Similar with respond.js
    - Working with type
    - Handle not exist, dissalow or unavailable path.
  - error configuration
  - tmp configuration
  - Introduce websocket file
  - Introduce nodejs file
  - Introduce ejs file
  - Introduce nhtml file
  - Parsing with bodyParser plugin
  -Introducing System Admin
    - Working with sysadmin for the first time
  - References

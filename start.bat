@echo off

REM If you want to make this apps always active and restart each it got error,
REM you could install `pm2` to be process manager of this apps.
REM install by `npm install -g pm2`, then change `npm start` to `pm2 start main.js`.
REM Read https://pm2.keymetrics.io/ to do more.

echo Checking node_modules...
IF EXIST node_modules (
    echo.
    echo nodu_modules exist
    echo.
    echo run npm start
    npm start
) ELSE (
    echo.
    echo node_modules didn't exist
    echo run npm install
    npm install
    echo.
    echo run npm start
    npm start
)
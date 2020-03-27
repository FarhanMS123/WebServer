@echo off

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
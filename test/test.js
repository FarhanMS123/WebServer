var x = {b:3, c:4, d:5, e:6}

console.log(x);

require("./test2.js")(x);

console.log(x);
console.log(global.theX);

setInterval(function(){}, 1);

const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();

//flag1
myEmitter.on("event1", function(){
    console.log("This is an event1 listener with flag1");
});

//flag2
myEmitter.on("event1", function(){
    console.log("This is an event1 listener with flag2");
});

myEmitter.emit("event1");
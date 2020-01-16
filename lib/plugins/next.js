module.exports = function(req,res,next){
    if(typeof next == "function") next();
}
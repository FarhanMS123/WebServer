module.exports = function(req,res,next){
    //OnErr Request Handler
    var err = undefined, do_next = true;
    if(arguments[3]){
        err = req;
        req = res;
        res = next;
        next = arguments[3];
    }
    // if(do_next) next(err);
    // res.next_router(err);
    // if(res.statusCode != 200){next(err); return;}
    if(res.finished){next(err); return;}

    /*
        req.app.get("config");
    */
}
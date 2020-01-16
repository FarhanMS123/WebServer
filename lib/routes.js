/**
 * This is routes.js plugins
 * It would get all, routes in config.routes propertise
 * the propertise should be set as
 * "/URL/on/Web": HTTPStatusCode<number:403,404> | "/Routes/to/Another/Path"<string> | function(req,res,next){}
 * For examples :
 *	"/dir1/*" : "/dir2/index.html",
 *	"/google" : "https://google.com"
 *	"/nothing" : 404
 *	"/handled" : "FILE ./web/index.html"
 */
(function(module) {
    var authorized = require("./authorized");

    module.exports["index"] = authorized(function(req, res, next, user) {
        res.redirect("/start");
    });

    module.exports.auth = require("./auth");
    module.exports.start = require("./start");
})(module);

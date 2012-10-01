(function(module) {
    var fb = require("fb-js");


    module.exports = function(req, res, next) {
        if (!req.query.token) {
            return next(new Error("No token specified!"));
        }

        var facebook = new fb(req.query.token);
        facebook.api("GET", "/me", function(error, profile) {
            if (error) {
                return next(error);
            }

            req.session.fb_token = req.query.token;
            req.session.fb_id    = profile.id;

            res.redirect("/");
        });
    };
})(module);

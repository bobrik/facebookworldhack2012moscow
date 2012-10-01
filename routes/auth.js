(function(module) {
    var fb   = require("fb-js"),
        User = require("../lib/User");


    module.exports = function(req, res, next) {
        if (!req.query.token) {
            return next(new Error("No token specified!"));
        }

        var facebook = new fb(req.query.token);
        facebook.api("GET", "/me", function(error, profile) {
            if (error) {
                return next(error);
            }

            var user = new User(profile.id);
            user.load(function(error) {
                if (error) {
                    return next(error);
                }

                user.setFacebookToken(req.query.token);
                user.setName(profile.name);
                user.save(function() {
                    req.session.fb_token = req.query.token;
                    req.session.fb_id    = profile.id;

                    res.redirect("/");
                });
            });
        });
    };
})(module);

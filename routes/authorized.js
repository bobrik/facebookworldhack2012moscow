(function(module) {
    var User = require("../lib/User");

    module.exports = function(callback) {
        return function(req, res, next) {
            if (req.session.fb_id) {
                var user = new User(req.session.fb_id);
                user.load(function(error) {
                    if (error) {
                        return next(error);
                    }

                    callback(req, res, next, user);
                });
            } else {
                res.redirect("/auth/facebook");
            }
        }
    };
})(module);

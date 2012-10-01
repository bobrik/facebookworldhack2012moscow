(function(module) {
    var authorized = require("./authorized");

    module.exports = authorized(function(req, res, next, user) {
        user.getFriends(function(error, friends) {
            if (error) {
                return next(error);
            }

            res.render('start', {
                pageName : "startPage",
                title    : 'Create new game',
                friends  : friends
            });
        });
    });
})(module);

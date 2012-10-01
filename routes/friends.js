(function(module) {
    var authorized = require("./authorized");

    module.exports = authorized(function(req, res, next, user) {
        user.getFriends(function(error, friends) {
            if (error) {
                return next(error);
            }

            res.render('friends', {
                pageName : "friends",
                title    : 'Choose friend for a game',
                friends  : friends
            });
        });
    });
})(module);

(function(module) {
    var authorized = require("./authorized");

    module.exports = authorized(function(req, res, next, user) {
        user.getFriends(function(error, friends) {
            if (error) {
                return next(error);
            }

            friends = friends.sort(function(left, right) {
                if (left.installed) {
                    return -1;
                } else if (right.installed) {
                    return 1;
                }

                return 0;
            });

            res.render('friends', {
                pageName : "friends",
                title    : 'Choose friend for a game',
                friends  : friends
            });
        });
    });
})(module);

(function(module) {
    var authorized = require("./authorized"),
        User       = require("../lib/User");

    module.exports = authorized(function(req, res, next, user) {
        if (!req.body.word) {
            return next(new Error("No required params!"));
        }

        function creator(id) {
            user.createGame(opponent.getId(), req.body.word, function(error, game) {
                if (error) {
                    return next(error);
                }

                game.exportFor(user, function(error, data) {
                    if (error) {
                        return next(error);
                    }

                    res.json({
                        game: data
                    });
                });
            });
        }

        if (!req.body.id) {
            User.getRandom(function(error, opponent) {
                if (error) {
                    return next(error);
                }

                creator(opponent.getId());
            });
        } else {
            creator(req.body.id);
        }
    });
})(module);

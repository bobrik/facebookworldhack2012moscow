(function(module) {
    var authorized = require("./authorized"),
        User       = require("../lib/User"),
        Game       = require("../lib/Game");

    module.exports = authorized(function(req, res, next, user) {
        if (!req.body.game_id || !req.body.word) {
            return next(new Error("No required params specified!"));
        }

        var game = new Game(req.body.game_id, undefined, user.getStorage());
        game.load(function(error) {
            if (error) {
                return next(error);
            }

            user.acceptGame(req.body.game_id, req.body.word, function(error, game) {
                if (error) {
                    return next(error);
                }

                game.exportFor(user, function(error, data) {
                    if (error) {
                        return next(error);
                    }

                    res.json({
                        game: data
                    })
                })
            });
        });
    });
})(module);

(function(module) {
    var authorized = require("./authorized"),
        User       = require("../lib/User"),
        Game       = require("../lib/Game");

    module.exports = authorized(function(req, res, next, user) {
        if (!req.query.game_id || !req.query.word || !req.query.letter) {
            return next(new Error("No required params specified!"));
        }

        var game = new Game(req.query.game_id, undefined, user.getStorage());
        game.load(function(error) {
            if (error) {
                return next(error);
            }

            user.acceptGame(req.query.game_id, req.query.word, req.query.letter, function(error, game) {
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

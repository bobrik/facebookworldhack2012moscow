(function(module) {
    var authorized = require("./authorized"),
        Game       = require("../lib/Game");

    module.exports = authorized(function(req, res, next, user) {
        if (!req.body.game_id || !req.body.letter) {
            return next(new Error("No game id or letter specified!"));
        }

        var game = new Game(req.body.id, undefined, user.getStorage());
        game.load(function(error) {
            if (error) {
                return next(error);
            }

            if (game.isFinished()) {
                return next(new Error("This game is finished already!"))
            }

            function afterMove(error, good) {
                if (error) {
                    return next(error);
                }

                game.updateState();
                game.save(function(error) {
                    if (error) {
                        return next(error);
                    }

                    game.exportFor(user, function(error, data) {
                        res.json({
                            good : good,
                            game : data
                        });

                        // make some stuff
                        if (game.isFinished()) {
                            // post to fb, etc
                        }
                    });
                })
            }

            if (game.get("started") == user.getId()) {
                game.guessFromStarter(req.body.letter, afterMove);
            } else if (game.get("opponent") == user.getId()) {
                game.guessFromOpponent(req.body.letter, afterMove);
            }
        });
    });
})(module);
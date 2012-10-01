(function(module) {
    var authorized = require("./authorized"),
        Game       = require("../lib/Game");;

    module.exports = authorized(function(req, res, next, user) {
        if (!res.body.game_id) {
            return next(new Error("No game id specified"));
        }

        var game = new Game(req.body.game_id, undefined, user.getStorage());
        game.load(function(error) {
            if (error) {
                return next(error);
            }

            function tipCallback(error, image) {
                if (error) {
                    console.log(error);
                }

                game.updateState();
                game.save(function(error) {
                    if (error) {
                        return next(error);
                    }

                    game.exportFor(user, function(error, data) {
                        if (error) {
                            return next(error);
                        }

                        res.json({
                            image : image,
                            game  : data
                        });

                        if (game.isFinished()) {
                            // do fb stuff
                        }
                    });
                });
            }

            if (game.get("started") == user.getId()) {
                user.makeTipForStarter(tipCallback);
            } else {
                user.makeTipForOpponent(tipCallback);
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
    });
})(module);

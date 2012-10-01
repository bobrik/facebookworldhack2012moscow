(function(module) {
    var authorized = require("./authorized"),
        Game       = require("../lib/Game");

    module.exports = authorized(function(req, res, next, user) {
        if (!req.query.game_id) {
            return next(new Error("No game specified!"));
        }

        var game = new Game(req.query.id, undefined, user.getStorage());
        game.load(function(error) {
            if (error) {
                return next(error);
            }

            game.exportFor(user.getId(), function(error, data) {
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
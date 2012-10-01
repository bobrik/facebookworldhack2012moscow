(function(module) {
    var authorized = require("./authorized");

    module.exports = function(req, res, next, user) {
        if (!req.query.id || !req.query.word) {
            return next(new Error("No required params!"));
        }

        user.createGame(req.query.id, req.query.word, function(error, game) {
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
    };
})(module);

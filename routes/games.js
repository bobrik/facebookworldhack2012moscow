(function(module) {
    var authorized = require("./authorized");

    module.exports = authorized(function(req, res, next, user) {
        user.getGames(function(error, games) {
            if (error) {
                return next(error);
            }

            var ids    = Object.keys(games),
                result = {};

            (function exportGame() {
                var id = ids.pop();

                if (!id) {
                    return res.json({
                        games: result
                    });
                }

                games[id].exportFor(user, function(error, data) {
                    if (error) {
                        console.log(error);
                        exportGame();
                        return;
                    }

                    result[id] = data;
                    process.nextTick(exportGame);
                });
            })();
        });
    });
})(module);

(function(module) {
    var authorized = require("./authorized"),
        Game       = require("./Game");

    module.exports = authorized(function(req, res, next, user) {
        var game = new Game(req.query.id, undefined, storage);
        game.load(function(error) {
            if (error) {
                console.log(error);
                return;
            }

            game.exportFor(user, function(error, data) {
                if (error) {
                    return next(error);
                }

                res.render('field', {
                    pageName : "field",
                    title    : 'Game',
                    data  : data
                });
            });
        })
    });
})(module);

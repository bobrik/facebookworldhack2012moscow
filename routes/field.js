(function(module) {
    var authorized = require("./authorized"),
        Game       = require("../lib/Game");

    module.exports = authorized(function(req, res, next, user) {
        res.render('field', {
            pageName : "field",
            title    : 'Game',
            game  : {test: 1}
        });
        /*
        var game = new Game(req.query.id, undefined, user.getStorage());
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
        }) */
    });
})(module);

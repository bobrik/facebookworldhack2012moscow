(function(module) {
    var authorized = require("./authorized"),
        User       = require("../lib/User");

    module.exports = authorized(function(req, res, next, user) {
        if (!req.body.word) {
            return next(new Error("No required params!"));
        }

        console.log(req.body);
        console.log("OOOooooo")

        function creator(id) {
            console.log('aaaaa')
            user.createGame(id, req.body.word, function(error, game) {
                if (error) {
                    return next(error);
                }

                console.log("eeee")

                game.exportFor(user, function(error, data) {
                    console.log("bbbbbbb")
                    console.log(error);
                    if (error) {
                        return next(error);
                    }

                    console.log("tttt")


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

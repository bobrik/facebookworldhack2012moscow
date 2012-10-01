(function(module) {
    var authorized = require("./authorized"),
        Game       = require("../lib/Game");

    module.exports = authorized(function(req, res, next, user) {
        res.render('field', {
            pageName : "field",
            title    : 'Game',
            game  : {
                user1: {
                    name: "Андрей Мищенко",
                    avatar: "http://photos-a.ak.fbcdn.net/hphotos-ak-snc6/178901_444075445612246_919694010_s.jpg",
                    word: [
                        "A",
                        null,
                        "C",
                        null,
                        "F"
                    ]
                },
                user2: {
                    name: "Иван Бобров",
                    avatar: "http://photos-a.ak.fbcdn.net/hphotos-ak-ash3/536784_318518181551004_1840344979_s.jpg",
                    word: [
                        null,
                        null,
                        null,
                        null,
                        "C",
                        null,
                        "F"
                    ]
                }
            }
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

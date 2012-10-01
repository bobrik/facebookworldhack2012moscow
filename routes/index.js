(function(module) {
    var authorized = require("./authorized");

    module.exports["index"] = authorized(function(req, res, next, user) {
        user.getFacebook(function(error, client) {
            console.log(user.getData())
        });
        res.redirect("/start");
    });

    module.exports.auth = require("./auth");
    module.exports.start = require("./start");
    module.exports.friends = require("./friends");
    module.exports.games = require("./games");
    module.exports.game = require("./game");
    module.exports.move = require("./move");
    module.exports.create = require("./create");
    module.exports.reply = require("./reply");
    module.exports.og_player = require("./og_player");
})(module);

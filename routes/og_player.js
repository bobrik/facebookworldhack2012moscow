(function(module) {
//    var token = 'AAADNpc3jObIBAO1swkT9kBfZA4Wj4EoZANE3KAhzSwZCWVXnZAcmPmrhtBEZCUvHnU5PZCHXEqLm4EzH8S2XIF1SBtxdZCY8qwerkXZAScdMAAZDZD',
//        fb    = require("fb-js"),
//        facebook = new fb(token);
//
    var User = require("../lib/User");

    module.exports = function(req, res) {
        if (!req.headers['user-agent'].match(/facebook/i)) {
            return res.redirect("/");
        }

        var user = new User(req.query.user_id);
        user.load(function(error) {
            if (error) {
                return res.redirect("/");
            }

            res.render("og_player", {
                title : 'Hangman: ' + user.getName(),
                pageName: "og_player",
                name  : user.getName(),
                image : "http://graph.facebook.com/" + user.getId() + "/picture?type=large",
                url   : "http://web372.verumnets.ru/og_player?user_id=" + req.query.user_id
            });
        });
    };
})(module);

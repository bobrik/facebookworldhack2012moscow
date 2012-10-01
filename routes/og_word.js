(function(module) {
    var px = require("../lib/500px");

    module.exports = function(req, res) {
        if (!req.headers['user-agent'].match(/facebook/i)) {
            return res.redirect("/");
        }

        if (!req.query.word) {
            return res.redirect("/");
        }

        px(req.query.word, function(error, image) {
            if (error) {
                console.log(error);
            }

            res.render("og_word", {
                title : req.query.word,
                length: req.query.word.length,
                pageName: "og_word",
                image : image ? image : "http://cs302709.userapi.com/v302709982/81a9/V4STjJ8buiI.jpg",
                url   : "http://web372.verumnets.ru/og_word?word=" + req.query.word
            });
        });
    };
})(module);

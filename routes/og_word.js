(function(module) {
    module.exports = function(req, res) {
        if (!req.headers['user-agent'].match(/facebook/i)) {
            return res.redirect("/");
        }

        if (!req.query.word) {
            return res.redirect("/");
        }

        res.render("og_word", {
            title : req.query.word,
            length: req.quert.word.length,
            pageName: "og_word",
            image : "http://cs302709.userapi.com/v302709982/81a9/V4STjJ8buiI.jpg",
            url   : "http://web372.verumnets.ru/og_word?word=" + req.query.word
        });
    };
})(module);

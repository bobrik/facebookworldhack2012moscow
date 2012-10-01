(function(module) {
    module.exports["index"] = function(req, res) {
        res.render('index', {
            pageName: "index",
            title  : 'Express',
            token  : req.session.fb_token
        });
    };

    module.exports.auth = require("./auth");
    module.exports.start = require("./start");
})(module);

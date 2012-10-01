(function(module) {
    module.exports.index = function(req, res) {
        res.render('index', {
            title  : 'Express',
            token  : req.session.fb_token
        });
    };

    module.exports.auth = require("./auth");
})(module);

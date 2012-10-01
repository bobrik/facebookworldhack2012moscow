(function(module) {
    var User = require("../lib/User");

    module.exports["index"] = function(req, res) {
        if (req.session.fb_id) {
            var user = new User(req.session.fb_id);
            user.load(function(error) {
                if (error) {
                    console.log(error);
                }

                console.log("User data", user.getData());
            });
        }

        res.render('index', {
            pageName: "index",
            title  : 'Express',
            token  : req.session.fb_token
        });
    };

    module.exports.auth = require("./auth");
    module.exports.start = require("./start");
})(module);

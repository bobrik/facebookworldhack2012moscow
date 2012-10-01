(function() {
    var express   = require('express'),
        routes    = require('./routes'),
        http      = require('http'),
        path      = require('path'),
        everyauth = require("everyauth"),
        io        = require("socket.io"),
        User      = require("./lib/User");

    everyauth
        .facebook
            .appId('226112007518642')
            .appSecret('76af7f166373601ceb7089e16bfbcb10')
            .scope("user_about_me,user_likes,user_interests,friends_likes,friends_interests,publish_actions,publish_stream")
            .findOrCreateUser(function(session, token, extra, profile) {
                session.fb_token = token;
                session.fb_id    = profile.id;

                var user = new User(profile.id);
                user.load(function(error) {
                    if (error) {
                        console.log(error);
                        return;
                    }

                    user.setFacebookToken(token);
                    user.setName(profile.name);
                    user.save();
                });

                return {
                    fb_token : token,
                    fb_id    : user.id
                }
            })
            .redirectPath('/');

    everyauth.everymodule.handleLogout(function(req, res) {
        req.session.destroy();
        res.redirect("/")
    });

    var app = express();

    app.configure('all', function() {
        app.set('port', process.env.PORT || 80);
        app.set('views', __dirname + '/views');
        app.set('view engine', 'jade');
        app.use(express.favicon());
        app.use(express.logger('dev'));
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(express.static(path.join(__dirname, 'public')));
        app.use(express.cookieParser());
        // set this to a secret value to encrypt session cookies
        app.use(express.session({
            secret: "wat"
        }));
        app.use(everyauth.middleware());
        app.use(app.router);
    });

    app.configure('development', function(){
        app.use(express.errorHandler());
    });

    app.get("/", routes.index);
    app.get("/auth", routes.auth);
    app.get("/start", routes.start);
    app.get("/friends", routes.friends);
    app.get("/games", routes.games);
    app.post("/game", routes.game);
    app.post("/move", routes.move);
    app.post("/create", routes.create);
    app.post("/reply", routes.reply);
    app.get("/field", routes.field);
    app.get("/og_player", routes.og_player);
    app.get("/og_word", routes.og_word);


    var server = http.createServer(app);

    server.listen(app.get('port'));
    console.log("Express server listening on port " + app.get('port'));

    io.listen(server);

    console.log("fb scope", everyauth.facebook.scope());
})();

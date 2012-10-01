(function(module) {
    var redis    = require("redis"),
        facebook = require("fb-js"),
        Game     = require("./Game"),
        storage  = redis.createClient();

    function User(id) {
        this.id   = id;
        this.data = undefined;
    };

    User.prototype.getId = function() {
        return this.id;
    }

    User.prototype.setFacebookToken = function(token) {
        this.data.token = token;
    };

    User.prototype.getFacebook = function(callback) {
        if (!this.data.token) {
            return callback(new Error("No token for " + this.id));
        }

        callback(undefined, new facebook(this.data.token));
    };

    User.prototype.load = function(callback) {
        var self = this;

        if (self.data) {
            return process.nextTick(callback);
        }

        storage.get("u_" + self.id, function(error, data) {
            if (error) {
                return callback(error);
            }

            if (!data) {
                data = {};
            } else {
                data = JSON.parse(data);
            }

            self.data = data;

            callback();
        });
    };

    User.prototype.save = function(callback) {
        if (!this.data) {
            return callback(new Error("User not loaded: " + this.id));
        }

        storage.set("u_" + this.id, JSON.stringify(this.data), callback);
    };

    User.prototype.getData = function() {
        return this.data;
    };

    User.prototype.getFriends = function(callback) {
        this.getFacebook(function(error, client) {
            if (error) {
                return callback(error);
            }

            client.api("GET", "/me/friends", {fields: "installed,picture,first_name"}, function(error, friends) {
                if (error) {
                    return callback(error);
                }

                callback(undefined, friends.data);
            });
        });
    };

    User.prototype.getGames = function(callback) {
        var self = this;

        storage.smembers("ug_" + self.id, function(error, ids) {
            if (error) {
                return callback(error);
            }

            var result = {};
            (function readGame() {
                var id = ids.pop(),
                    game;

                if (!id) {
                    return callback(undefined, result);
                }

                game = new Game(id, undefined, storage);
                game.load(function(error) {
                    if (error) {
                        console.log(error);
                        readGame();
                        return;
                    }

                    result[id] = game;
                    readGame();
                });
            })();
        });
    };

    User.prototype.createGame = function(opponentId, word, callback) {
        var self = this;

        storage.incr("game_id", function(error, id) {
            var game = new Game(id, game = {
                started   : self.id,
                opponent  : opponentId,
                firstWord : word,
                created   : new Date().getTime()
            }, storage);

            game.save(function(error) {
                if (error) {
                    return callback(error);
                }

                storage.sadd("ug_" + self.id, game.getId(), function() {
                    console.log("added game " + game.getId() + " for " + self.id + " | starter");
                });

                storage.sadd("ug_" + opponentId, game.getId(), function() {
                    console.log("added game " + game.getId() + " for " + self.id + " | opponent");
                });

                callback(undefined, game);
            });
        });
    };

    User.prototype.acceptGame = function(gameId, word, letter, callback) {
        var self = this,
            game = new Game(gameId, undefined, storage);

        game.load(function(error) {
            if (error) {
                return callback(error);
            }

            if (game.get("opponent") != self.id) {
                return callback(new Error("Trying to accept not owned game"));
            }


            game.set("secondWord", word);
            game.guessFromOpponent(letter, function(error) {
                if (error) {
                    return callback(error);
                }

                game.save(function(error) {
                    if (error) {
                        return callback(error);
                    }

                    callback(undefined, game);
                })
            });
        });
    };

    User.prototype.getStorage = function() {
        return storage;
    }

    module.exports = User;
})(module);

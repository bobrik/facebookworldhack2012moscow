(function(module) {
    var redis    = require("redis"),
        facebook = require("fb-js"),
        storage  = redis.createClient();

    function User(id) {
        this.id   = id;
        this.data = undefined;
    };

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
                return callback(errpr);
            }

            client.api("GET", "/me/friends", function(error, friends) {
                if (error) {
                    return callback(error);
                }

                callback(undefined, friends.data);
            });
        });
    };

    User.prototype.getAppFriends = function(callback) {
        this.getFriends(function(error, friends) {
            if (error) {
                return callback(error);
            }

            var keys = friends.map(function(friend) {
                    return "u_" + friend.id;
                }),
                result = [];

            storage.hmget(keys, function(error, found) {
                if (error) {
                    return callback(error);
                }

                friends.forEach(function(friend, index) {
                    if (found[index]) {
                        result.push(friend.id);
                    }
                });

                callback(undefined, result);
            });




        });
    };

    module.exports = User;
})(module);

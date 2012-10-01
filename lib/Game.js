(function(module) {
    var px = require("../lib/500px");

    function Game(id, data, storage) {
        this.id      = id;
        this.data    = data;
        this.storage = storage
    }

    Game.prototype.getId = function() {
        return this.id;
    };

    Game.prototype.set = function(key, value) {
        this.data[key] = value;
    };

    Game.prototype.get = function(key) {
        return this.data[key];
    };

    Game.prototype.getData = function() {
        return this.data;
    };

    Game.prototype.guessFromOpponent = function(letter, callback) {
        var self = this;

        if (!this.data.opponentGuesses) {
            this.data.opponentGuesses = [];
        }

        if (this.data.opponentGuesses.indexOf(letter) != -1) {
            return callback(new Error("Trying the same letter twice"));
        }

        this.data.opponentGuesses.push(letter);

        var right = false;

        this.data.firstWordGuessed = "";
        this.data.firstWord.split("").forEach(function(candidate) {
            if (self.data.opponentGuesses.indexOf(candidate) == -1) {
                self.data.firstWordGuessed += "_";
            } else {
                self.data.firstWordGuessed += candidate;
                right = true;
            }
        });

        if (!right) {
            if (!this.data.secondMistakes) {
                this.data.secondMistakes = 1;
            } else {
                this.data.secondMistakes += 1;
            }
        }

        callback(undefined, right);
    };

    Game.prototype.makeTipForStarter = function(callback) {
        var self = this;

        if (self.data.advicedStarter) {
            return callback();
        }

        px(self.data.secondWord, function(error, image) {
            if (image) {
                if (!self.data.firstMistakes) {
                    self.data.firstMistakes = 3;
                } else {
                    self.data.firstMistakes += 3;
                }
            }

            self.data.advicedStarter = true;

            callback(undefined, !!image);
        });
    };

    Game.prototype.makeTipForOpponent = function() {
        var self = this;

        if (self.data.advicedOpponent) {
            return callback();
        }

        px(self.data.firstWord, function(error, image) {
            if (image) {
                if (!self.data.secondMistakes) {
                    self.data.secondMistakes = 3;
                } else {
                    self.data.secondMistakes += 3;
                }
            }

            self.advicedOpponent = true;

            callback(undefined, !!image);
        });
    };

    Game.prototype.guessFromStarter = function(letter, callback) {
        var self = this;

        if (!this.data.starterGuesses) {
            this.data.starterGuesses = [];
        }

        if (this.data.starterGuesses.indexOf(letter) != -1) {
            return callback(new Error("Trying the same letter twice"));
        }

        this.data.starterGuesses.push(letter);

        var right = false;

        this.data.secondWordGuessed = "";
        this.data.secondWord.split("").forEach(function(candidate) {
            if (self.data.starterGuesses.indexOf(candidate) == -1) {
                self.data.secondWordGuessed += "_";
            } else {
                right = true;
                self.data.secondWordGuessed += candidate;
            }
        });

        if (!right) {
            if (!this.data.firstMistakes) {
                this.data.firstMistakes = 1;
            } else {
                this.data.firstMistakes += 1;
            }
        }

        callback(undefined, right);
    };

    Game.prototype.isFinished = function() {
        if (this.data.firstHangUp || this.data.secondHangUp) {
            return true;
        }

        if (this.data.firstWon || this.data.secondWon) {
            return true;
        }

        return false;
    };

    Game.prototype.updateState = function() {
        var self = this;

        if (this.data.firstMistakes >= 9) {
            this.data.firstHangUp = true;
            return;
        }

        if (this.data.secondMistakes >= 9) {
            this.data.secondHangUp = true;
            return;
        }

        if (this.data.starterGuesses) {
            var foundSecondWord = true;
            this.data.secondWord.split("").forEach(function(candidate) {
                if (self.data.starterGuesses.indexOf(candidate) == -1) {
                    foundSecondWord = false;
                }
            });

            if (foundSecondWord) {
                this.data.firstWon = true;
                return;
            }
        }

        if (this.data.opponentGuesses) {
            var foundFirstWord = true;
            this.data.firstWord.split("").forEach(function(candidate) {
                if (self.data.opponentGuesses.indexOf(candidate) == -1) {
                    foundFirstWord = false;
                }
            });

            if (foundFirstWord) {
                this.data.secondWon = true;
                return;
            }
        }
    };

    Game.prototype.save = function(callback) {
        this.storage.set("game_" + this.id, JSON.stringify(this.data), callback);
    };

    Game.prototype.load = function(callback) {
        var self = this;

        self.storage.get("game_" + self.id, function(error, data) {
            if (error) {
                return callback(error);
            }

            if (!data) {
                return callback(new Error("No game data found for " + self.id));
            }

            self.data = JSON.parse(data);

            callback();
        });
    };

    Game.prototype.exportFor = function(user, callback) {
        var self   = this,
            userId = user.getId();

        if (this.data.opponent == userId || this.data.started == userId) {
            var result = {
                game_id: self.getId()
            };

            if (this.data.opponent == userId) {
                result.opponent = {
                    id   : user.getId(),
                    name : user.getName(),
                    photo: "http://graph.facebook.com/" + user.getId() + "/picture?type=square"
                };

                user.getFacebook(function(error, client) {
                    if (error) {
                        return callback(error);
                    }

                    console.log("/" + self.data.started);

                    client.api("GET", "/" + self.data.started, function(error, profile) {
                        if (error) {
                            return callback(error);
                        }

                        result.started = {
                            id : self.data.started,
                            name: profile.name,
                            photo: "http://graph.facebook.com/" + self.data.started + "/picture?type=square"
                        }

                        resume();
                    });
                });
            } else {
                result.started = {
                    id   : user.getId(),
                    name : user.getName(),
                    photo: "http://graph.facebook.com/" + user.getId() + "/picture?type=square"
                };

                user.getFacebook(function(error, client) {
                    if (error) {
                        return callback(error);
                    }

                    console.log("/" + self.data.opponent);

                    client.api("GET", "/" + self.data.opponent, function(error, profile) {
                        if (error) {
                            return callback(error);
                        }

                        result.opponent = {
                            id : self.data.opponent,
                            name: profile.name,
                            photo: "http://graph.facebook.com/" + self.data.opponent + "/picture?type=square"
                        }

                        resume();
                    });
                });
            }

            function resume() {
                if (!self.data.starterGuesses) {
                    self.data.starterGuesses = [];
                }

                if (!self.data.opponentGuesses) {
                    self.data.opponentGuesses = [];
                }

                result.starterWord = "";
                self.data.firstWord.split("").forEach(function(candidate) {
                    if (self.data.opponentGuesses.indexOf(candidate) == -1) {
                        result.starterWord += "_";
                    } else {
                        result.starterWord += candidate;
                    }
                });

                if (!self.data.secondWord) {
                    console.log("no second word for " + self.getId());
                    if (userId == self.data.opponent) {
                        result.incoming = true;
                    } else {
                        result.outgoing = true;
                    }

                    return callback(undefined, result);
                }

                result.opponentWord = "";
                self.data.secondWord.split("").forEach(function(candidate) {
                    if (self.data.starterGuesses.indexOf(candidate) == -1) {
                        result.opponentWord += "_";
                    } else {
                        result.opponentWord += candidate;
                    }
                });

                result.starterGuesses = self.data.starterGuesses || 0;
                result.opponentGuesses = self.data.opponentGuesses || 0;

                result.firstMistakes = self.data.firstMistakes;
                result.secondMistakes = self.data.secondMistakes;

                console.log(self.data.opponentGuesses.length, self.data.starterGuesses.length)

                if (self.data.opponentGuesses.length != self.data.starterGuesses.length && userId == self.data.started) {
                    result.move = true;
                } else {
                    result.move = false;
                }

                callback(undefined, result);
            }
        } else {
            callback(new Error("Trying to export game for unknown user"));
        }
    };


    module.exports = Game;
})(module);

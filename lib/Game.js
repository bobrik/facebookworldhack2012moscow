(function(module) {
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

        if (this.data.firstMistakes >= 5) {
            this.data.firstHangUp = true;
            return;
        }

        if (this.data.secondMistakes >= 5) {
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

    Game.prototype.exportFor = function(userId, callback) {
        var self = this;

        if (this.data.opponent == userId || this.data.started == userId) {
            var result = {
                started  : this.data.started,
                opponent : this.data.opponent
            };

            if (!this.data.starterGuesses) {
                this.data.starterGuesses = [];
            }

            if (!this.data.opponentGuesses) {
                this.data.opponentGuesses = [];
            }

            result.starterWord = "";
            this.data.firstWord.split("").forEach(function(candidate) {
                if (self.data.opponentGuesses.indexOf(candidate) == -1) {
                    result.starterWord += "_";
                } else {
                    result.starterWord += candidate;
                }
            });

            if (!this.data.secondWord) {
                if (userId == this.data.opponent) {
                    result.incoming = true;
                } else {
                    result.outgoing = true;
                }

                return callback(undefined, result);
            }

            result.opponentWord = "";
            this.data.secondWord.split("").forEach(function(candidate) {
                if (self.data.starterGuesses.indexOf(candidate) == -1) {
                    result.opponentWord += "_";
                } else {
                    result.opponentWord += candidate;
                }
            });

            result.starterGuesses = this.data.starterGuesses;
            result.opponentGuesses = this.data.opponentGuesses;

            console.log(this.data.opponentGuesses.length, this.data.starterGuesses.length)

            if (this.data.opponentGuesses.length != this.data.starterGuesses.length && userId == this.data.started) {

                result.move = true;
            }

            callback(undefined, result);
        } else {
            callback(new Error("Trying to export game for unknown user"));
        }
    };


    module.exports = Game;
})(module);

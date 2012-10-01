(function(module) {
    var oauth = require("oauth");
    var querystring = require("querystring");
    var o = new oauth.OAuth(
        "",
        "",
        "mRTY4jDe4rmM3W99u1LawjAzNqCR0RE3SxRxT4BK",
        "GgOHCUDIYP4mhw7YbiL52ryu1DtfxC73BKTdjBtn",
        '1.0', null, 'HMAC-SHA1', null,
        []);

    module.exports = function(term, callback) {
        var url = 'https://api.500px.com/v1/photos/search'
        var params = {term: term};

        o.get(url + '?' + querystring.stringify(params),
            "dmBQ90xhCgLIm0zDqfaCtRynHBkO7wycAfCoDNub",
            "Ize8ZH3YFoqbkC4v0mb65EZW8E8Oj6W3JpSQ7cSf",
            function(error, data) {
                if (error) {
                    return callback(error);
                }

                data = JSON.parse(data);

                try {
                    callback(undefined, data.photos[Math.round(Math.random() * data.photos.length - 1)].image_url.replace("/2.jpg", "/3.jpg"));
                } catch (e) {
                    callback(undefined, undefined);
                }
            });
    };
})(module);
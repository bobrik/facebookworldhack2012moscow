(function(module) {
    module.exports.start = function(req, res) {
        res.render('start', {
            pageName: "start",
            title  : 'Create new game'
        });
    };
})(module);

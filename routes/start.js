(function(module) {
    module.exports = function(req, res) {
        res.render('start', {
            pageName: "start",
            title  : 'Create new game'
        });
    };
})(module);

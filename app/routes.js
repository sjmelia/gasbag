module.exports = function(app) {
    app.get('/', function(req, res) {
        res.render('index');
    });

    app.get('/profile', function(req, res) {
        res.render('profile', {
            user: {
                name: 'Steve'
            }
        });
    });
};

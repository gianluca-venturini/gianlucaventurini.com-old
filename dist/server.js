var express = require('express'),
    swig = require('swig'),
    mongojs = require("mongojs");

var app = express();

app.engine('html', swig.renderFile);

app.set('view engine', 'html');
app.set('views', __dirname + '/view');
app.set('view cache', false);
swig.setDefaults({ cache: false });

// Static resources
app.use('/css', express.static(__dirname + '/css'));
app.use('/font', express.static(__dirname +'/font'));
app.use('/img', express.static(__dirname +'/img'));
app.use('/js', express.static(__dirname +'/js'));

// MongoDB resources
var connectionString = "gianlucaventurini"; // "username:password@example.com/mydb"
var collections = ["static", "project"];
var db = mongojs(connectionString, collections);

app.get('/', function (req, res) {
    db.static.find({}, function(err, statics) {
        var staticConfig = statics[0];  // Static configuration of the website

        db.project.find({}, function(err, projects) {
            res.render('index', {
                mail: staticConfig.mail,
                social: staticConfig.social,
                projects: projects
            });
        });
    });
});

console.log(__dirname);

app.listen(3000);

console.log('Application Started on http://localhost:3000/');

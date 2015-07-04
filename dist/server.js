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

/* Decomment when they'll fix the bug
db.on('error',function(err) {
    console.log('database error', err);
});

db.on('ready',function() {
    console.log('database connected');
});
*/

app.get('/', function (req, res) {
    db.static.find({}, function(err, statics) {
        var staticConfig = statics[0];  // Static configuration of the website

        db.project.find({}, function(err, projects) {
            res.render('index', {
                mail: staticConfig.mail,
                about: staticConfig.about,
                social: staticConfig.social,
                projects: projects
            });
        });
    });
});

app.get('/project/:project_title', function(req, res) {

    var re = new RegExp(req.params.project_title, "i");
    db.project.find({title: re}, function(err, projects) {

        if(projects.length > 1) {
            res.status(500).send('Something broke!');
            return;
        }
        else if(projects.length < 1) {
            res.status(404).send('Project not found!');
            return;
        }

        var project = projects[0];  // Take first element
        res.render('project_page', {
            project: project
        });
    });

});

console.log(__dirname);

app.listen(3000);

console.log('Application Started on http://localhost:3000/');

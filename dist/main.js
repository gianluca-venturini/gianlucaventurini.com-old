var express = require('express'),
    swig = require('swig');

var app = express();

app.engine('html', swig.renderFile);

app.set('view engine', 'html');
app.set('views', __dirname + '/view');
app.set('view cache', false);
swig.setDefaults({ cache: false });

// Static resources
app.use('/css', express.static(__dirname + '/css'));
app.use('/fonts', express.static(__dirname +'/fonts'));
app.use('/img', express.static(__dirname +'/img'));
app.use('/js', express.static(__dirname +'/js'));

app.get('/', function (req, res) {
    res.render('index', {});
});

console.log(__dirname);

app.listen(3000);

console.log('Application Started on http://localhost:3000/');

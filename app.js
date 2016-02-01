var express = require('express');
var mongoose = require('mongoose');

mongoose.connect('mongodb://192.168.99.100/urlshortener');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('mongodb connected');
});
var urlSchema = mongoose.Schema({
  url: String
});
var Url = mongoose.model('url', urlSchema);

var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/new/:url(*)', function (req, res) {
  res.send(req.params.url);
});

app.listen(8080, function () {
  console.log('server running on port 8080');
});

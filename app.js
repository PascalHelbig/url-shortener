var express = require('express');
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

mongoose.connect('mongodb://192.168.99.100/urlshortener');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('mongodb connected');
});
autoIncrement.initialize(db);
var urlSchema = mongoose.Schema({
  url: String
});
urlSchema.plugin(autoIncrement.plugin, 'url');
var Url = mongoose.model('url', urlSchema);

var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/new/:url(*)', function (req, res) {
  Url.findOne({url: req.params.url}, function (err, url) {
    if (err) throw err;
    if (url) {
      return res.json(url);
    } else {
      var newUrl = new Url({url: req.params.url});
      newUrl.save(function (err, url) {
        if (err) throw err;
        res.json(url);
      });
    }
  });

});

app.listen(8080, function () {
  console.log('server running on port 8080');
});

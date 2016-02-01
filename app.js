var express = require('express');
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var validator = require('validator');
var fs = require('fs');
var markdown = require('markdown').markdown;

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
  fs.readFile('README.md', function (err, data) {
    if (err) {
      return console.error(err);
    }
    res.send(markdown.toHTML(data.toString()));
  });
});

app.get('/new/:url(*)', function (req, res) {
  if (!validator.isURL(req.params.url)) {
    return res.json({error: "URL invalid"});
  }

  Url.findOne({url: req.params.url}, function (err, url) {
    if (err) throw err;
    if (url) {
      return res.json(outputUrl(url));
    } else {
      var newUrl = new Url({url: req.params.url});
      newUrl.save(function (err, url) {
        if (err) throw err;
        res.json(outputUrl(url));
      });
    }
  });
});

app.get('/:id', function (req, res) {
  Url.findOne({_id: req.params.id}, function (err, url) {
    if (err) return res.end();
    if (url) {
      res.redirect(url.url);
    } else {
      res.json({error: "No short url found for given input"})
    }
  });
});

app.listen(8080, function () {
  console.log('server running on port 8080');
});

function outputUrl(url) {
  return {
    original_url: url.url,
    short_url: "localhost:8080/" + url._id
  };
}

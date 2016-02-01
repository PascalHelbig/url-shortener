var express = require('express');
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

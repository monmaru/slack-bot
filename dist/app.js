'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bot = require('./bot');

var _bot2 = _interopRequireDefault(_bot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var bot = new _bot2.default(process.env.WEBHOOK_URL);

app.get('/slack/github-trend', function (req, res) {
  bot.sayGithubTrend();
  console.log('finished github-trend');
  res.status(200).end();
});

app.get('/slack/weather', function (req, res) {
  bot.sayWeather();
  console.log('finished weather');
  res.status(200).end();
});

app.get('/slack/oreilly', function (req, res) {
  console.log('test');
  bot.sayOreilly();
  console.log('finished oreilly');
  res.status(200).end();
});

app.get('/ping', function (req, res) {
  res.status(200).send('pong').end();
});

var PORT = process.env.PORT || 8080;
app.listen(PORT, function () {
  console.log('App listening on port ' + PORT);
  console.log('Press Ctrl+C to quit.');
});
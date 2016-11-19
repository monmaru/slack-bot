'use strict';

var _botkit = require('botkit');

var _botkit2 = _interopRequireDefault(_botkit);

var _cron = require('cron');

var _cron2 = _interopRequireDefault(_cron);

var _github = require('./github');

var _github2 = _interopRequireDefault(_github);

var _weather = require('./weather');

var _weather2 = _interopRequireDefault(_weather);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CronJob = _cron2.default.CronJob;
var controller = _botkit2.default.slackbot();
var LF = '\n';

var bot = controller.spawn({ token: process.env.token }).startRTM(function (err) {
  if (err) {
    throw new Error('Could not connect to Slack');
  }

  var tz = 'Asia/Tokyo';

  new CronJob({
    cronTime: '00 00 18 * * 0-6',
    onTick: sayGithubTrend,
    start: true,
    timeZone: tz
  });

  new CronJob({
    cronTime: '00 00 7 * * 0-6',
    onTick: sayWeather,
    start: true,
    timeZone: tz
  });
});

controller.hears(['こんにちわ'], ['direct_message', 'direct_mention', 'mention'], function (bot, message) {
  return bot.reply(message, 'こんにちわ');
});

var sayGithubTrend = function sayGithubTrend() {
  var trend = new _github2.default();
  var languages = ['C#', 'Go', 'Python'];
  languages.forEach(function (lang) {
    trend.fetch(lang).then(function (repos) {
      var attachments = Array.from(repos).map(function (repo) {
        return {
          'fallback': repo.url,
          'title': repo.title,
          'title_link': repo.url,
          'text': '' + repo.description + LF + repo.star,
          'color': '#F35A00'
        };
      });

      bot.say({
        'channel': '#github',
        'username': 'github_bot',
        'text': 'Trending in ' + lang,
        'attachments': attachments,
        'icon_emoji': ':moyai:'
      });
    }).catch(function (err) {
      return console.log(err);
    });
  });
};

var sayWeather = function sayWeather() {
  var weather = new _weather2.default();
  var yokohama = '140010';
  weather.fetch(yokohama).then(function (result) {
    var attachments = Array.from(result.forecasts).filter(function (f) {
      return f.dateLabel !== '明後日';
    }).map(function (f) {
      var min = f.temperature.min == null ? '' : f.temperature.min.celsius;
      var max = f.temperature.max == null ? '' : f.temperature.max.celsius;

      return {
        'fallback': f.telop,
        'title': f.telop,
        'text': '' + f.date + LF + '\u6700\u4F4E\u6C17\u6E29 ' + min + LF + '\u6700\u9AD8\u6C17\u6E29 ' + max,
        'image_url': f.image.url,
        'color': '#F35A00'
      };
    });

    bot.say({
      'channel': '#general',
      'username': 'weather_bot',
      'text': result.title,
      'attachments': attachments,
      'icon_emoji': ':earth_asia:'
    });
  }).catch(function (err) {
    return console.log(err);
  });
};
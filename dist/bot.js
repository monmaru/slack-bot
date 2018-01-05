'use strict';

var _botkit = require('botkit');

var _botkit2 = _interopRequireDefault(_botkit);

var _cron = require('cron');

var _cron2 = _interopRequireDefault(_cron);

var _github = require('./github');

var _github2 = _interopRequireDefault(_github);

var _weather = require('./weather');

var _weather2 = _interopRequireDefault(_weather);

var _oreilly = require('./oreilly');

var _oreilly2 = _interopRequireDefault(_oreilly);

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
    cronTime: '00 00 20 * * 0-6',
    onTick: sayWeather,
    start: true,
    timeZone: tz
  });

  new CronJob({
    cronTime: '00 00 10 * * 0',
    onTick: sayOreilly,
    start: true,
    timeZone: tz
  });
});

var sayGithubTrend = function sayGithubTrend() {
  var trend = new _github2.default();
  var languages = ['C#', 'Go', 'Python', 'Kotlin'];
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
      return f.temperature.min !== null && f.temperature.max !== null;
    }).map(function (f) {
      var min = f.temperature.min == null ? '' : f.temperature.min.celsius;
      var max = f.temperature.max == null ? '' : f.temperature.max.celsius;
      return {
        'fallback': f.telop,
        'title': f.telop,
        'text': '' + f.date + LF + '\u6700\u4F4E\u6C17\u6E29 ' + min + LF + '\u6700\u9AD8\u6C17\u6E29 ' + max,
        'image_url': f.image.url,
        'color': '#307EB8'
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

var sayOreilly = function sayOreilly() {
  var oreilly = new _oreilly2.default();
  return Promise.resolve().then(function () {
    return oreilly.fetchBookCatalog();
  }).then(function (books) {
    var attachments = books.map(function (book) {
      return {
        'fallback': book.title,
        'title': book.title,
        'title_link': book.link,
        'text': '' + book.creator + LF + 'updated at ' + book.date,
        'image_url': book.imageUrl,
        'color': '#C71337'
      };
    });
    bot.say({
      'channel': '#general',
      'username': 'oreilly_bot',
      'text': 'OReilly Japan New & Upcomming',
      'attachments': attachments,
      'icon_emoji': ':books:'
    });
  }).then(function () {
    return oreilly.fetchNewEBooks();
  }).then(function (ebooks) {
    var attachments = ebooks.map(function (ebook) {
      return {
        'fallback': ebook.title,
        'title': ebook.title,
        'title_link': ebook.link,
        'text': 'updated at ' + ebook.updated,
        'image_url': ebook.imageUrl,
        'color': '#C71337'
      };
    });
    bot.say({
      'channel': '#general',
      'username': 'oreilly_bot',
      'text': 'Ebook Store - New Release',
      'attachments': attachments,
      'icon_emoji': ':books:'
    });
  }).catch(function (err) {
    return console.log(err);
  });
};
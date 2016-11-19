'use strict';

var _botkit = require('botkit');

var _botkit2 = _interopRequireDefault(_botkit);

var _cron = require('cron');

var _cron2 = _interopRequireDefault(_cron);

var _github = require('./github');

var _github2 = _interopRequireDefault(_github);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CronJob = _cron2.default.CronJob;
var controller = _botkit2.default.slackbot();

var bot = controller.spawn({ token: process.env.token }).startRTM(function (err) {
  if (err) {
    throw new Error('Could not connect to Slack');
  }

  new CronJob({
    cronTime: '00 00 18 * * 0-6',
    onTick: sayGithubTrend,
    start: true,
    timeZone: 'Asia/Tokyo'
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
          'text': repo.description + '\n' + repo.star,
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
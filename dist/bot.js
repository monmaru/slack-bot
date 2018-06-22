'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slackNode = require('slack-node');

var _slackNode2 = _interopRequireDefault(_slackNode);

var _github = require('./github');

var _github2 = _interopRequireDefault(_github);

var _weather = require('./weather');

var _weather2 = _interopRequireDefault(_weather);

var _oreilly = require('./oreilly');

var _oreilly2 = _interopRequireDefault(_oreilly);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Bot = function () {
  function Bot(webhookUrl) {
    var slack = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new _slackNode2.default();

    _classCallCheck(this, Bot);

    this.LF = '\n';
    this.webhookUrl = webhookUrl;
    this.slack = slack;
  }

  _createClass(Bot, [{
    key: 'sayGithubTrend',
    value: function sayGithubTrend() {
      var _this = this;

      var trend = new _github2.default();
      var languages = ['C#', 'Go', 'Python', 'Kotlin'];
      languages.forEach(function (lang) {
        trend.fetch(lang).then(function (repos) {
          var attachments = Array.from(repos).map(function (repo) {
            return {
              'fallback': repo.url,
              'title': repo.title,
              'title_link': repo.url,
              'text': '' + repo.description + _this.LF + repo.star,
              'color': '#F35A00'
            };
          });

          _this.slack.setWebhook(_this.webhookUrl);
          _this.slack.webhook({
            'channel': '#github',
            'username': 'github_bot',
            'text': 'Trending in ' + lang,
            'icon_emoji': ':moyai:',
            'attachments': attachments
          }, function (err, response) {
            if (err !== null || response.statusCode !== 200) {
              console.log(err);
              console.log(response);
            }
          });
        }).catch(function (err) {
          return console.log(err);
        });
      });
    }
  }, {
    key: 'sayWeather',
    value: function sayWeather() {
      var _this2 = this;

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
            'text': '' + f.date + _this2.LF + '\u6700\u4F4E\u6C17\u6E29 ' + min + _this2.LF + '\u6700\u9AD8\u6C17\u6E29 ' + max,
            'image_url': f.image.url,
            'color': '#307EB8'
          };
        });

        _this2.slack.setWebhook(_this2.webhookUrl);
        _this2.slack.webhook({
          'channel': '#general',
          'username': 'weather_bot',
          'text': result.title,
          'icon_emoji': ':earth_asia:',
          'attachments': attachments
        }, function (err, response) {
          if (err !== null || response.statusCode !== 200) {
            console.log(err);
            console.log(response);
          }
        });
      }).catch(function (err) {
        return console.log(err);
      });
    }
  }, {
    key: 'sayOreilly',
    value: function sayOreilly() {
      var _this3 = this;

      var oreilly = new _oreilly2.default();
      oreilly.fetchBookCatalog().then(function (books) {
        var attachments = books.map(function (book) {
          return {
            'fallback': book.title,
            'title': book.title,
            'title_link': book.link,
            'text': '' + book.creator + _this3.LF + 'updated at ' + book.date,
            'image_url': book.imageUrl,
            'color': '#C71337'
          };
        });

        _this3.slack.setWebhook(_this3.webhookUrl);
        _this3.slack.webhook({
          'channel': '#general',
          'username': 'oreilly_bot',
          'text': 'OReilly Japan New & Upcomming',
          'icon_emoji': ':books:',
          'attachments': attachments
        }, function (err, response) {
          if (err !== null || response.statusCode !== 200) {
            console.log(err);
            console.log(response);
          }
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
        _this3.slack.setWebhook(_this3.webhookUrl);
        _this3.slack.webhook({
          'channel': '#general',
          'username': 'oreilly_bot',
          'text': 'Ebook Store - New Release',
          'icon_emoji': ':books:',
          'attachments': attachments
        }, function (err, response) {
          if (err !== null || response.statusCode !== 200) {
            console.log(err);
            console.log(response);
          }
        });
      }).catch(function (err) {
        return console.log(err);
      });
    }
  }]);

  return Bot;
}();

exports.default = Bot;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cheerioHttpcli = require('cheerio-httpcli');

var _cheerioHttpcli2 = _interopRequireDefault(_cheerioHttpcli);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Trend = function () {
  function Trend() {
    _classCallCheck(this, Trend);
  }

  _createClass(Trend, [{
    key: 'fetch',
    value: function fetch(lang) {
      return new Promise(function (resolve, reject) {
        _cheerioHttpcli2.default.fetch('https://github.com/trending', { l: lang }).then(function (result) {
          var $ = result.$;
          var repos = Array.from($('.repo-list li')).map(function (element) {
            var $elem = $(element);
            var url = $elem.find('h3 a').attr('href');
            var refs = url.split('/');

            return {
              owner: refs[1],
              title: refs[2],
              url: 'https://github.com' + url,
              description: $elem.find('div[class="py-1"] p').text().trim(),
              language: $elem.find('span[itemprop="programmingLanguage"]').text().trim(),
              star: $elem.find('span[class="float-right"]').text().trim()
            };
          });

          resolve(repos);
        }).catch(function (err) {
          return reject(err);
        });
      });
    }
  }]);

  return Trend;
}();

exports.default = Trend;
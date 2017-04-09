'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cheerioHttpcli = require('cheerio-httpcli');

var _cheerioHttpcli2 = _interopRequireDefault(_cheerioHttpcli);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Oreilly = function () {
  function Oreilly() {
    _classCallCheck(this, Oreilly);

    this.baseURL = 'https://www.oreilly.co.jp/';
  }

  _createClass(Oreilly, [{
    key: 'fetchBookCatalog',
    value: function fetchBookCatalog() {
      var _this = this;

      return this.scrape(this.baseURL + 'catalog/soon.xml', function ($) {
        return Array.from($('rdf\\:RDF > item').map(function (i, item) {
          return {
            title: $(item).find('title').text(),
            link: $(item).find('link').text(),
            imageUrl: $(item).find('content\\:encoded').text().match(/img src="(.*)" /)[1],
            creator: $(item).find('dc\\:creator').text(),
            date: _this.fmtAsDate($(item).find('dc\\:date').text())
          };
        }));
      });
    }
  }, {
    key: 'fetchNewEBooks',
    value: function fetchNewEBooks() {
      var _this2 = this;

      return this.scrape(this.baseURL + 'ebook/new_release.atom', function ($) {
        return Array.from($('feed > entry').map(function (i, entry) {
          return {
            title: $(entry).find('title').text(),
            link: $(entry).find('link').attr('href'),
            imageUrl: $(entry).find('summary').text().match(/img src="(.*)" class=/)[1],
            updated: _this2.fmtAsDate($(entry).find('updated').text())
          };
        }));
      });
    }
  }, {
    key: 'scrape',
    value: function scrape(url, fn) {
      return new Promise(function (resolve, reject) {
        _cheerioHttpcli2.default.fetch(url).then(function (result) {
          return resolve(fn(result.$));
        }).catch(function (err) {
          return reject(err);
        });
      });
    }
  }, {
    key: 'fmtAsDate',
    value: function fmtAsDate(str) {
      return str.replace(/(.*?)-(.*?)-(.*?)T.*/, '$1/$2/$3');
    }
  }]);

  return Oreilly;
}();

exports.default = Oreilly;
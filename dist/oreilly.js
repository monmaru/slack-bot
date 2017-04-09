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

      return new Promise(function (resolve, reject) {
        _cheerioHttpcli2.default.fetch(_this.baseURL + 'catalog/soon.xml').then(function (result) {
          var $ = result.$;
          var books = Array.from($('rdf\\:RDF > item').map(function (i, item) {
            return {
              title: $(item).find('title').text(),
              link: $(item).find('link').text(),
              imageUrl: $(item).find('content\\:encoded').text().match(/img src="(.*)" /)[1],
              creator: $(item).find('dc\\:creator').text(),
              date: $(item).find('dc\\:date').text().replace(/(.*?)-(.*?)-(.*?)T.*/, '$1/$2/$3')
            };
          }));
          resolve(books);
        }).catch(function (err) {
          return reject(err);
        });
      });
    }
  }, {
    key: 'fetchNewEBooks',
    value: function fetchNewEBooks() {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        _cheerioHttpcli2.default.fetch(_this2.baseURL + 'ebook/new_release.atom').then(function (result) {
          var $ = result.$;
          var ebooks = Array.from($('feed > entry').map(function (i, entry) {
            return {
              title: $(entry).find('title').text(),
              link: $(entry).find('link').attr('href'),
              imageUrl: $(entry).find('summary').text().match(/img src="(.*)" class=/)[1],
              updated: $(entry).find('updated').text().replace(/(.*?)-(.*?)-(.*?)T.*/, '$1/$2/$3')
            };
          }));
          resolve(ebooks);
        }).catch(function (err) {
          return reject(err);
        });
      });
    }
  }]);

  return Oreilly;
}();

exports.default = Oreilly;
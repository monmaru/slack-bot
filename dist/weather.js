'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Weather = function () {
  function Weather() {
    _classCallCheck(this, Weather);
  }

  _createClass(Weather, [{
    key: 'fetch',
    value: function fetch(city) {
      return new Promise(function (resolve, reject) {
        var url = 'http://weather.livedoor.com/forecast/webservice/json/v1?city=' + city;
        (0, _request2.default)(url, function (err, response, body) {
          if (err) {
            reject(err);
          }

          if (response.statusCode === 200) {
            resolve(JSON.parse(body));
          } else {
            reject(new Error(response.statusCode));
          }
        });
      });
    }
  }]);

  return Weather;
}();

exports.default = Weather;
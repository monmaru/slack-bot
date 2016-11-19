import request from 'request';

export default class Weather {
  fetch(city) {
    return new Promise((resolve, reject) => {
      const url = `http://weather.livedoor.com/forecast/webservice/json/v1?city=${city}`;
      request(url, (err, response, body) => { 
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
}

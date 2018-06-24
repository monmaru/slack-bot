import { getResponseData } from './axios-wrapper';

export class Weather {
  async fetch(city) {
    return await getResponseData(`http://weather.livedoor.com/forecast/webservice/json/v1?city=${city}`);
  }
}

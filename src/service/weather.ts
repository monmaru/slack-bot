import { getResponseData } from './axios-wrapper';

export class WeatherService {
  async fetch(city: string): Promise<ForecastResult> {
    return getResponseData<ForecastResult>(`http://weather.livedoor.com/forecast/webservice/json/v1?city=${city}`);
  }
}

export interface PinpointLocation {
  link: string;
  name: string;
}

export interface Min {
  celsius: string;
  fahrenheit: string;
}

export interface Max {
  celsius: string;
  fahrenheit: string;
}

export interface Temperature {
  min: Min;
  max: Max;
}

export interface Image {
  width: number;
  url: string;
  title: string;
  height: number;
}

export interface Forecast {
  dateLabel: string;
  telop: string;
  date: string;
  temperature: Temperature;
  image: Image;
}

export interface Location {
  city: string;
  area: string;
  prefecture: string;
}

export interface Provider {
  link: string;
  name: string;
}

export interface Image2 {
  width: number;
  link: string;
  url: string;
  title: string;
  height: number;
}

export interface Copyright {
  provider: Provider[];
  link: string;
  title: string;
  image: Image2;
}

export interface Description {
  text: string;
  publicTime: Date;
}

export interface ForecastResult {
  pinpointLocations: PinpointLocation[];
  link: string;
  forecasts: Forecast[];
  location: Location;
  publicTime: Date;
  copyright: Copyright;
  title: string;
  description: Description;
}

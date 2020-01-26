import cheerio from 'cheerio';
import { getResponseData } from './axios-wrapper';

export interface Trend {
  owner: string;
  title: string;
  url: string;
  description: string;
  language: string;
  star: string;
}

export class TrendService {
  async fetch(lang: string): Promise<Trend[]> {
    const data = await getResponseData<string>(`https://github.com/trending/${encodeURIComponent(lang)}`);
    const $ = cheerio.load(data);
    return Array.from($('div.application-main div.Box article.Box-row')).map(element => {
      const $elem = $(element);
      const url = $elem.find('h1 a').attr('href');
      const refs = url!.split('/');

      return {
        owner: refs[1],
        title: refs[2],
        url: `https://github.com${url}`,
        description: $elem
          .find('p.text-gray')
          .text()
          .trim(),
        language: $elem
          .find('span[itemprop="programmingLanguage"]')
          .text()
          .trim(),
        star: $elem
          .find('a.muted-link')
          .first()
          .text()
          .trim(),
      };
    });
  }
}

import cheerio from 'cheerio';
import { getResponseData } from './axios-wrapper';

const baseURL = 'https://www.oreilly.co.jp/';

export class Oreilly {

  async fetchBookCatalog() {
    const data = await getResponseData(`${baseURL}catalog/soon.xml`);
    const $ = cheerio.load(data, { xmlMode: true });
    return Array.from($('rdf\\:RDF > item').map((_i, item) => {
      return {
        title: $(item).find('title').text(),
        link: $(item).find('link').text(),
        imageUrl: $(item).find('content\\:encoded').text().match(/img src="(.*)" /)[1],
        creator: $(item).find('dc\\:creator').text(),
        date: this.fmtAsDate($(item).find('dc\\:date').text())
      };
    }));
  }

  async fetchNewEBooks() {
    const data = await getResponseData(`${baseURL}ebook/new_release.atom`);
    const $ = cheerio.load(data, { xmlMode: true });
    return Array.from($('feed > entry').map((_i, entry) => {
      return {
        title: $(entry).find('title').text(),
        link: $(entry).find('link').attr('href'),
        imageUrl: $(entry).find('summary').text().match(/img src="(.*)" class=/)[1],
        updated: this.fmtAsDate($(entry).find('updated').text())
      };
    }));
  }

  fmtAsDate(str) {
    return str.replace(/(.*?)-(.*?)-(.*?)T.*/, '$1/$2/$3');
  }
}
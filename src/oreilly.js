import client from 'cheerio-httpcli';

export default class Oreilly {
  constructor() {
    this.baseURL = 'https://www.oreilly.co.jp/';
  }

  fetchBookCatalog() {
    return this.scrape(`${this.baseURL}catalog/soon.xml`, ($) => {
      return Array.from($('rdf\\:RDF > item').map((i, item) => {
        return {
          title: $(item).find('title').text(),
          link: $(item).find('link').text(),
          imageUrl: $(item).find('content\\:encoded').text().match(/img src="(.*)" /)[1],
          creator: $(item).find('dc\\:creator').text(),
          date: this.fmtAsDate($(item).find('dc\\:date').text())
        };
      }));
    });
  }

  fetchNewEBooks() {
    return this.scrape(`${this.baseURL}ebook/new_release.atom`, ($) => {
      return Array.from($('feed > entry').map((i, entry) => {
        return {
          title: $(entry).find('title').text(),
          link: $(entry).find('link').attr('href'),
          imageUrl: $(entry).find('summary').text().match(/img src="(.*)" class=/)[1],
          updated: this.fmtAsDate($(entry).find('updated').text())
        };
      }));
    });
  }

  scrape(url, fn) {
    return new Promise((resolve, reject) => {
      client.fetch(url)
        .then((result) => resolve(fn(result.$)))
        .catch((err) => reject(err));
    });
  }

  fmtAsDate(str) {
    return str.replace(/(.*?)-(.*?)-(.*?)T.*/, '$1/$2/$3');
  }
}
import client from 'cheerio-httpcli';

export default class Oreilly {
  constructor() {
    this.baseURL = 'https://www.oreilly.co.jp/';
  }

  fetchBookCatalog() {
    // TODO `${this.baseURL}catalog/soon.xml`
  }

  fetchNewEBooks () {
    return new Promise((resolve, reject) => {
      client.fetch(`${this.baseURL}ebook/new_release.atom`).then((result) => {
        const $ = result.$;
        const ebooks = Array.from($('feed > entry').map((i, entry) => {
          const e = $(entry);
          return {
            title: e.find('title').text(),
            link: e.find('link').attr('href'),
            imageUrl: e.find('summary').text().match(/img src="(.*)" class=/)[1],
            updated: e.find('updated').text()
          };
        }));
        resolve(ebooks);
      }).catch((err) => reject(err));
    });
  }
}
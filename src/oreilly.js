import client from 'cheerio-httpcli';

export default class Oreilly {
  constructor() {
    this.baseURL = 'https://www.oreilly.co.jp/';
  }

  fetchBookCatalog() {
    return new Promise((resolve, reject) => {
      client.fetch(`${this.baseURL}catalog/soon.xml`).then((result) => {
        const $ = result.$;
        const books = Array.from($('rdf\\:RDF > item').map((i, item) => {
          return {
            title: $(item).find('title').text(),
            link: $(item).find('link').text(),
            imageUrl: $(item).find('content\\:encoded').text().match(/img src="(.*)" /)[1],
            creator: $(item).find('dc\\:creator').text(),
            date: $(item).find('dc\\:date').text().replace(/(.*?)-(.*?)-(.*?)T.*/, '$1/$2/$3')
          };
        }));
        resolve(books);
      }).catch((err) => reject(err));
    });
  }

  fetchNewEBooks() {
    return new Promise((resolve, reject) => {
      client.fetch(`${this.baseURL}ebook/new_release.atom`).then((result) => {
        const $ = result.$;
        const ebooks = Array.from($('feed > entry').map((i, entry) => {
          return {
            title: $(entry).find('title').text(),
            link: $(entry).find('link').attr('href'),
            imageUrl: $(entry).find('summary').text().match(/img src="(.*)" class=/)[1],
            updated: $(entry).find('updated').text().replace(/(.*?)-(.*?)-(.*?)T.*/, '$1/$2/$3')
          };
        }));
        resolve(ebooks);
      }).catch((err) => reject(err));
    });
  }
}
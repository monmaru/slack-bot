import client from 'cheerio-httpcli';

export default class Oreilly {
  constructor() {
    this.baseURL = 'https://www.oreilly.co.jp/';
  }

  bookSoon() {
    return new Promise((resolve, reject) => {
      client.fetch(`${this.baseURL}catalog/soon.xml`).then((result) => {
        const $ = result.$;
        const repos = Array.from($('.repo-list li')).map((element) => {
          const $elem = $(element);
          const url = $elem.find('h3 a').attr('href');
          const refs = url.split('/');
          
          return {
            owner: refs[1],
            title: refs[2],
            url: 'https://github.com' + url,
            description: $elem.find('div[class="py-1"] p').text().trim(),
            language: $elem.find('span[itemprop="programmingLanguage"]').text().trim(),
            star: $elem.find('span[class="float-right"]').text().trim()
          };
        });
        
        resolve(repos);
      }).catch((err) => reject(err));
    });
  }

  fetchNewEBooks () {
    return new Promise((resolve, reject) => {
      client.fetch(`${this.baseURL}ebook/new_release.atom`).then((result) => {
        const $ = result.$;
        $('feed > entry').each((i, entry) => {
          const title = entry.find('title').text();
          const link = entry.find('link').attr('href');
          const updated = entry.find('updated').text();
          
          return {
            owner: refs[1],
            title: refs[2],
            url: 'https://github.com' + url,
            description: $elem.find('div[class="py-1"] p').text().trim(),
            language: $elem.find('span[itemprop="programmingLanguage"]').text().trim(),
            star: $elem.find('span[class="float-right"]').text().trim()
          };
        });
        
        resolve(repos);
      }).catch((err) => reject(err));
    });
  }
}
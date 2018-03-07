import client from 'cheerio-httpcli';

export default class Trend {
  fetch(lang) {
    return new Promise((resolve, reject) => {
      client.fetch(`https://github.com/trending/${lang}`).then((result) => {
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
}
import cheerio from 'cheerio';
import { getResponseData } from './axios-wrapper';

const baseURL = 'https://www.oreilly.co.jp/';

export interface BookCatalog {
  title: string;
  link: string;
  imageUrl: string;
  creator: string;
  date: string;
}

export interface EBook {
  title: string;
  link: string;
  imageUrl: string;
  updated: string;
}

export class OreillyService {
  async fetchBookCatalog(): Promise<BookCatalog[]> {
    const data = await getResponseData<string>(`${baseURL}catalog/soon.xml`);
    const $ = cheerio.load(data, { xmlMode: true });
    return Array.from($('rdf\\:RDF > item')).map(item => {
      return {
        title: $(item)
          .find('title')
          .text(),
        link: $(item)
          .find('link')
          .text(),
        imageUrl: $(item)
          .find('content\\:encoded')
          .text()
          .match(/img src="(.*)" /)![1],
        creator: $(item)
          .find('dc\\:creator')
          .text(),
        date: this.fmtAsDate(
          $(item)
            .find('dc\\:date')
            .text(),
        ),
      };
    });
  }

  async fetchNewEBooks(): Promise<EBook[]> {
    const data = await getResponseData<string>(`${baseURL}ebook/new_release.atom`);
    const $ = cheerio.load(data, { xmlMode: true });
    return Array.from($('feed > entry')).map(entry => {
      return {
        title: $(entry)
          .find('title')
          .text(),
        link: $(entry)
          .find('link')
          .attr('href')!,
        imageUrl: $(entry)
          .find('summary')
          .text()
          .match(/img src="(.*)" class=/)![1],
        updated: this.fmtAsDate(
          $(entry)
            .find('updated')
            .text(),
        ),
      };
    });
  }

  fmtAsDate(text: string) {
    return text.replace(/(.*?)-(.*?)-(.*?)T.*/, '$1/$2/$3');
  }
}

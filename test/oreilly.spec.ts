import 'mocha';
import assert from 'power-assert';
import { OreillyService } from '../src/service/oreilly';

describe('oreilly', () => {
  describe('#fetchNewEBooks()', () => {
    it('should be success', async function() {
      const service = new OreillyService();
      const ebooks = await service.fetchNewEBooks();
      ebooks.forEach(b => {
        assert(typeof b.title === 'string');
        assert(typeof b.link === 'string');
        assert(typeof b.imageUrl === 'string');
        assert(typeof b.updated === 'string');
      });
    });

    it('should be success', async function() {
      const oreilly = new OreillyService();
      const books = await oreilly.fetchBookCatalog();
      books.forEach(b => {
        assert(typeof b.title === 'string');
        assert(typeof b.link === 'string');
        assert(typeof b.imageUrl === 'string');
        assert(typeof b.creator === 'string');
        assert(typeof b.date === 'string');
      });
    });
  });
});

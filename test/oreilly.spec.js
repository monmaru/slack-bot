import assert from 'power-assert';
import Oreilly from '../src/oreilly';

describe('oreilly', () => {
  describe('#fetchNewEBooks()', () => {
    it('should be success', async function() {
      const expected = 'string';
      const oreilly = new Oreilly();
      const ebooks = await oreilly.fetchNewEBooks();
      ebooks.forEach((b) => {
        assert(typeof b.title === expected);
        assert(typeof b.link === expected);
        assert(typeof b.imageUrl === expected);
        assert(typeof b.updated === expected);
      });
    });
  });
});
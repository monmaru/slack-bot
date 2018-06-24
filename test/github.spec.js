import assert from 'power-assert';
import { Trend } from '../src/service/github';

describe('trend', () => {
  describe('#fetch()', () => {
    it('should be success', async function() {
      this.timeout(20000);
      const expected = 'string';
      const trend = new Trend();
      const repos = await trend.fetch('javascript');
      repos.forEach((r) => {
        assert(typeof r.title === expected);
        assert(typeof r.url === expected);
        assert(typeof r.description === expected);
        assert(typeof r.language === expected);
        assert(typeof r.star === expected);
      });
    });
  });
});
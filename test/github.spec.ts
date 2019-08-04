import 'mocha';
import assert from 'power-assert';
import { TrendService } from '../src/service/github';

describe('trend', () => {
  describe('#fetch()', () => {
    it('should be success', async function() {
      this.timeout(20000);
      const service = new TrendService();
      const repos = await service.fetch('javascript');
      repos.forEach(r => {
        assert(typeof r.title === 'string');
        assert(typeof r.url === 'string');
        assert(typeof r.description === 'string');
        assert(typeof r.language === 'string');
        assert(typeof r.star === 'string');
      });
    });
  });
});

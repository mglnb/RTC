import { assert } from 'chai';
import add from '../src/sample';

describe('Test sample', () => {
  it('should return 3', () => {
    const result = add(1, 2);
    assert.equal(3, result, '1 + 2 should equal to 3');
  });
});

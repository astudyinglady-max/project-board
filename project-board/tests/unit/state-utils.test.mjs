/**
 * kit/state-utils.mjs 단위 테스트 (Node 내장 node:test)
 * 실행: node --test tests/unit/state-utils.test.mjs (project-board 디렉토리에서)
 */
import { test, describe } from 'node:test';
import assert from 'node:assert';
import { computeProgressPercent } from '../../kit/state-utils.mjs'; // project-board/ 기준 tests/unit/ -> kit/

describe('computeProgressPercent', () => {
  test('전체 0이면 0 반환', () => {
    assert.strictEqual(computeProgressPercent(0, 0), 0);
    assert.strictEqual(computeProgressPercent(5, 0), 0);
  });

  test('완료/전체 비율대로 0..100 반환', () => {
    assert.strictEqual(computeProgressPercent(0, 10), 0);
    assert.strictEqual(computeProgressPercent(1, 2), 50);
    assert.strictEqual(computeProgressPercent(2, 3), 67);
    assert.strictEqual(computeProgressPercent(5, 10), 50);
    assert.strictEqual(computeProgressPercent(10, 10), 100);
  });

  test('total이 null/undefined면 0 반환', () => {
    assert.strictEqual(computeProgressPercent(1, null), 0);
    assert.strictEqual(computeProgressPercent(1, undefined), 0);
  });

  test('100 초과·0 미만이어도 0..100으로 제한', () => {
    assert.strictEqual(computeProgressPercent(15, 10), 100);
    assert.strictEqual(computeProgressPercent(-1, 10), 0);
  });
});

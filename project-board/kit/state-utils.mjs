/**
 * 워크플로우 상태 관련 순수 함수 (단위 테스트 대상).
 * CLI·HTML에서 사용하는 공통 로직을 모아 두었습니다.
 */

/**
 * 완료 수와 전체 수로 진행률 퍼센트를 계산합니다.
 * @param {number} done - 완료된 Step 수
 * @param {number} total - 전체 Step 수
 * @returns {number} 0..100 정수
 */
export function computeProgressPercent(done, total) {
  if (total == null || total === 0) return 0;
  const pct = (Number(done) / Number(total)) * 100;
  return Math.min(100, Math.max(0, Math.round(pct)));
}

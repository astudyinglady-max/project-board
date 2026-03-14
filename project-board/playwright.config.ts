import { defineConfig, devices } from '@playwright/test';

/**
 * 환경변수 BASE_URL이 설정되어 있으면 그 값을 사용합니다.
 * - 로컬: http://localhost:8080 (python -m http.server 8080 으로 서빙)
 * - CI:   환경변수로 주입 (예: GitHub Actions에서 BASE_URL=http://localhost:8080)
 */
const BASE_URL = process.env.BASE_URL ?? 'http://localhost:8080';
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests/e2e',

  /* 테스트 실패 시 전체 중단 여부 — CI에서만 활성화 */
  forbidOnly: isCI,

  /* CI에서는 재시도 2회, 로컬에서는 재시도 없음 */
  retries: isCI ? 2 : 0,

  /* CI에서는 단일 워커 (안정성), 로컬에서는 CPU 코어 수 자동 */
  workers: isCI ? 1 : undefined,

  /* CI: GitHub Actions 리포터 / 로컬: HTML 리포터 */
  reporter: isCI ? 'github' : 'html',

  use: {
    baseURL: BASE_URL,

    /* 실패한 테스트의 첫 번째 재시도 시 트레이스 수집 */
    trace: 'on-first-retry',

    /* 실패 시 스크린샷 자동 캡처 */
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /**
   * 로컬 개발 시 python http.server를 자동으로 실행합니다.
   * CI에서는 BASE_URL 환경변수로 이미 실행 중인 서버를 가정합니다.
   *
   * CI에서 서버를 직접 실행하려면:
   *   python3 -m http.server 8080 &
   *   BASE_URL=http://localhost:8080 npx playwright test
   */
  webServer: isCI
    ? undefined
    : {
        command: 'python3 -m http.server 8080',
        url: 'http://localhost:8080',
        reuseExistingServer: true,
      },
});

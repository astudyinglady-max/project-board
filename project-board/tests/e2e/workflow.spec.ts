import { test, expect } from '@playwright/test';

test.describe('워크플로우 가이드 (docs/workflow.html)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/docs/workflow.html');
    await page.evaluate(() => localStorage.removeItem('ccwf_v5'));
    await page.reload();
  });

  test('페이지가 정상적으로 로드된다', async ({ page }) => {
    await expect(page).toHaveTitle(/Claude Code 작업 순서/);
    await expect(page.locator('.header h1')).toContainText('Claude Code 작업 순서');
  });

  test('초기 진도율이 0%로 표시된다', async ({ page }) => {
    await expect(page.locator('#progress-label')).toContainText('0%');
    await expect(page.locator('#progress-fill')).toHaveCSS('width', '0px');
  });

  test('전체 6개 Phase가 표시된다', async ({ page }) => {
    await expect(page.locator('.phase')).toHaveCount(6);
  });

  // ─── 핵심 시나리오: 첫 방문 → Phase 열기 → 프롬프트 복사 → QC 체크 ──────
  test('Phase 클릭 시 단계 내용이 펼쳐진다', async ({ page }) => {
    await expect(page.locator('#pb-0')).not.toHaveClass(/open/);
    await page.locator('#ph-0').click();
    await expect(page.locator('#pb-0')).toHaveClass(/open/);
    await expect(page.locator('#pb-0')).toBeVisible();
  });

  test('Phase를 다시 클릭하면 접힌다', async ({ page }) => {
    await page.locator('#ph-0').click();
    await expect(page.locator('#pb-0')).toHaveClass(/open/);
    await page.locator('#ph-0').click();
    await expect(page.locator('#pb-0')).not.toHaveClass(/open/);
  });

  test('Step 클릭 시 프롬프트 목록이 펼쳐진다', async ({ page }) => {
    await page.locator('#ph-0').click();
    await expect(page.locator('#sb-0-s-0')).toBeHidden();
    await page.locator('#pb-0 .step-head').first().click();
    await expect(page.locator('#sb-0-s-0')).toBeVisible();
    await expect(page.locator('#sb-0-s-0 .copy-btn').first()).toBeVisible();
  });

  test('프롬프트 복사 버튼 클릭 시 완료 상태로 변경된다', async ({ page }) => {
    // headless 환경에서 clipboard API 사용 가능하도록 mock 처리
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: () => Promise.resolve() },
        writable: true,
        configurable: true,
      });
    });
    await page.goto('/docs/workflow.html');

    await page.locator('#ph-0').click();
    await page.locator('#pb-0 .step-head').first().click();

    const copyBtn = page.locator('#sb-0-s-0 .copy-btn').first();
    await copyBtn.click();

    // 클립보드 처리 후 UI 갱신 대기 (헤드리스/CI에서 Promise 기반 동작 반영)
    await expect(copyBtn).toHaveClass(/done/, { timeout: 3000 });
    await expect(copyBtn).toContainText('복사됨');
  });

  test('QC 섹션을 열고 체크리스트 항목을 체크할 수 있다', async ({ page }) => {
    // Phase 1 (기획)에 QC 체크리스트 있음
    await page.locator('#ph-1').click();
    await page.locator('#pb-1 .qc-head').click();

    const firstItem = page.locator('#pb-1 .checklist-item').first();
    const checkbox = firstItem.locator('.checkbox');
    await expect(checkbox).not.toHaveClass(/checked/);

    await firstItem.click();
    await expect(checkbox).toHaveClass(/checked/);
  });

  // ─── 진도율 업데이트 ─────────────────────────────────────────────────────
  test('QC 항목 체크 후 진도율이 올라간다', async ({ page }) => {
    await page.locator('#ph-1').click();
    await page.locator('#pb-1 .qc-head').click();
    await page.locator('#pb-1 .checklist-item').first().click();

    // 전체 진도율이 0%에서 변경되어야 함
    await expect(page.locator('#progress-label')).not.toContainText('(0 /');
  });

  test('체크 취소 시 진도율이 다시 내려간다', async ({ page }) => {
    await page.locator('#ph-1').click();
    await page.locator('#pb-1 .qc-head').click();
    await page.locator('#pb-1 .checklist-item').first().click();
    await expect(page.locator('#progress-label')).not.toContainText('(0 /');

    // 다시 클릭해서 취소
    await page.locator('#pb-1 .checklist-item').first().click();
    await expect(page.locator('#progress-label')).toContainText('(0 /');
  });

  // ─── localStorage 영속성 ─────────────────────────────────────────────────
  test('체크 상태가 페이지 리로드 후에도 유지된다', async ({ page }) => {
    await page.locator('#ph-1').click();
    await page.locator('#pb-1 .qc-head').click();
    await page.locator('#pb-1 .checklist-item').first().click();

    await page.reload();

    // 리로드 후 openPhases/openSections 상태가 localStorage에서 복원됨
    // → Phase 1과 QC 섹션이 이미 열린 상태. #cb-1-qc-0 클래스 확인
    await expect(page.locator('#cb-1-qc-0')).toHaveClass(/checked/);
  });

  test('열린 Phase 상태가 리로드 후에도 유지된다', async ({ page }) => {
    await page.locator('#ph-1').click();
    await expect(page.locator('#pb-1')).toHaveClass(/open/);

    await page.reload();
    await expect(page.locator('#pb-1')).toHaveClass(/open/);
  });

  // ─── 오류 상황: 초기화 ──────────────────────────────────────────────────
  test('초기화 버튼으로 전체 상태를 초기화할 수 있다', async ({ page }) => {
    // 먼저 상태 설정
    await page.locator('#ph-1').click();
    await page.locator('#pb-1 .qc-head').click();
    await page.locator('#pb-1 .checklist-item').first().click();
    await expect(page.locator('#progress-label')).not.toContainText('(0 /');

    // 초기화 (confirm 승인)
    page.on('dialog', dialog => dialog.accept());
    await page.locator('.reset-btn').first().click();

    await expect(page.locator('#progress-label')).toContainText('(0 /');
    await expect(page.locator('#cb-1-qc-0')).not.toHaveClass(/checked/);
  });

  test('초기화 취소 시 상태가 유지된다', async ({ page }) => {
    await page.locator('#ph-1').click();
    await page.locator('#pb-1 .qc-head').click();
    await page.locator('#pb-1 .checklist-item').first().click();

    // 초기화 취소
    page.on('dialog', dialog => dialog.dismiss());
    await page.locator('.reset-btn').first().click();

    await expect(page.locator('#pb-1 .checklist-item').first().locator('.checkbox')).toHaveClass(/checked/);
  });
});

// ─── 모바일 뷰포트 (375px) ────────────────────────────────────────────────────
test.describe('워크플로우 가이드 - 모바일 (375px)', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/docs/workflow.html');
    await page.evaluate(() => localStorage.removeItem('ccwf_v5'));
    await page.reload();
  });

  test('모바일에서 페이지가 정상적으로 로드된다', async ({ page }) => {
    await expect(page.locator('.header h1')).toBeVisible();
    await expect(page.locator('#progress-label')).toBeVisible();
  });

  test('모바일에서 Phase를 열고 프롬프트를 확인할 수 있다', async ({ page }) => {
    await page.locator('#ph-0').click();
    await expect(page.locator('#pb-0')).toHaveClass(/open/);

    await page.locator('#pb-0 .step-head').first().click();
    await expect(page.locator('#sb-0-s-0 .copy-btn').first()).toBeVisible();
  });

  test('모바일에서 QC 체크리스트를 체크할 수 있다', async ({ page }) => {
    await page.locator('#ph-1').click();
    await page.locator('#pb-1 .qc-head').click();

    await page.locator('#pb-1 .checklist-item').first().click();
    await expect(page.locator('#cb-1-qc-0')).toHaveClass(/checked/);
  });
});

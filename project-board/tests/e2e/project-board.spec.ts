import { test, expect } from '@playwright/test';

test.describe('프로젝트 보드 (docs/index.html)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/docs/index.html');
    await page.evaluate(() => localStorage.removeItem('pb_state'));
    await page.reload();
  });

  test('페이지가 정상적으로 로드된다', async ({ page }) => {
    await expect(page).toHaveTitle('Project Board');
    await expect(page.locator('.header h1')).toContainText('Project Board');
  });

  test('초기 상태에서 빈 상태 메시지가 표시된다', async ({ page }) => {
    await expect(page.locator('#empty-projects')).toBeVisible();
    await expect(page.locator('#empty-projects')).toContainText('프로젝트가 없어요');
  });

  test('새 프로젝트 추가 폼이 기본으로 표시된다', async ({ page }) => {
    await expect(page.locator('#add-project-form')).toBeVisible();
    await expect(page.locator('#inp-name')).toBeVisible();
  });

  // ─── 핵심 시나리오: 첫 방문 → 프로젝트 생성 → 보드 확인 ─────────────────
  test('프로젝트를 추가하면 목록에 표시되고 보드로 이동한다', async ({ page }) => {
    await page.fill('#inp-name', 'E2E 테스트 프로젝트');
    await page.fill('#inp-desc', '테스트용 프로젝트 설명');
    await page.getByRole('button', { name: '프로젝트 추가' }).click();

    // 보드 탭으로 자동 전환됨
    await expect(page.locator('#tab-board')).toHaveClass(/active/);
    await expect(page.locator('#board-proj-name')).toContainText('E2E 테스트 프로젝트');
    await expect(page.locator('#board-content')).toBeVisible();
  });

  test('보드에 전체 Phase 목록이 표시된다', async ({ page }) => {
    await page.fill('#inp-name', '테스트 프로젝트');
    await page.getByRole('button', { name: '프로젝트 추가' }).click();

    // 6개 Phase (0~5)
    await expect(page.locator('.phase-block')).toHaveCount(6);
  });

  test('Step 체크 시 완료 표시가 된다', async ({ page }) => {
    await page.fill('#inp-name', '테스트 프로젝트');
    await page.getByRole('button', { name: '프로젝트 추가' }).click();

    const firstCheck = page.locator('.step-check').first();
    await expect(firstCheck).not.toHaveClass(/done/);
    await firstCheck.click();
    await expect(firstCheck).toHaveClass(/done/);
  });

  test('Step 체크 후 진도율이 업데이트된다', async ({ page }) => {
    await page.fill('#inp-name', '테스트 프로젝트');
    await page.getByRole('button', { name: '프로젝트 추가' }).click();

    await expect(page.locator('#stat-pct')).toContainText('0%');
    await page.locator('.step-check').first().click();
    await expect(page.locator('#stat-pct')).not.toContainText('0%');
  });

  test('프로젝트 목록 탭으로 돌아가면 카드가 표시된다', async ({ page }) => {
    await page.fill('#inp-name', '테스트 프로젝트');
    await page.getByRole('button', { name: '프로젝트 추가' }).click();

    await page.locator('#tab-projects').click();
    await expect(page.locator('.project-card')).toHaveCount(1);
    await expect(page.locator('.pc-title')).toContainText('테스트 프로젝트');
  });

  // ─── 오류 상황 ────────────────────────────────────────────────────────────
  test('프로젝트명 없이 제출하면 경고 메시지가 표시된다', async ({ page }) => {
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('프로젝트명을');
      await dialog.accept();
    });

    await page.getByRole('button', { name: '프로젝트 추가' }).click();
    // 빈 상태 유지 — 프로젝트가 추가되지 않아야 함
    await expect(page.locator('#empty-projects')).toBeVisible();
  });

  // ─── localStorage 영속성 ─────────────────────────────────────────────────
  test('페이지 리로드 후에도 프로젝트가 유지된다', async ({ page }) => {
    await page.fill('#inp-name', '리로드 테스트');
    await page.getByRole('button', { name: '프로젝트 추가' }).click();

    await page.reload();
    await expect(page.locator('.project-card')).toHaveCount(1);
    await expect(page.locator('.pc-title')).toContainText('리로드 테스트');
  });

  test('Step 체크 상태가 리로드 후에도 유지된다', async ({ page }) => {
    await page.fill('#inp-name', '영속성 테스트');
    await page.getByRole('button', { name: '프로젝트 추가' }).click();

    await page.locator('.step-check').first().click();
    await page.reload();

    // 리로드 후 보드 탭으로 이동
    await page.locator('#tab-board').click();
    await expect(page.locator('.step-check').first()).toHaveClass(/done/);
  });

  // ─── 프로젝트 삭제 ────────────────────────────────────────────────────────
  test('프로젝트를 삭제할 수 있다', async ({ page }) => {
    await page.fill('#inp-name', '삭제 테스트');
    await page.getByRole('button', { name: '프로젝트 추가' }).click();

    await page.locator('#tab-projects').click();
    await expect(page.locator('.project-card')).toHaveCount(1);

    page.on('dialog', dialog => dialog.accept());
    await page.getByRole('button', { name: '삭제' }).click();
    await expect(page.locator('#empty-projects')).toBeVisible();
  });

  // ─── JSON 내보내기 ─────────────────────────────────────────────────────────
  test('내보내기 버튼 클릭 시 파일 다운로드가 시작된다', async ({ page }) => {
    await page.fill('#inp-name', '내보내기 테스트');
    await page.getByRole('button', { name: '프로젝트 추가' }).click();

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: '내보내기' }).click(),
    ]);

    expect(download.suggestedFilename()).toBe('project-board-backup.json');
  });
});

// ─── 모바일 뷰포트 (375px) ────────────────────────────────────────────────────
test.describe('프로젝트 보드 - 모바일 (375px)', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/docs/index.html');
    await page.evaluate(() => localStorage.removeItem('pb_state'));
    await page.reload();
  });

  test('모바일에서 페이지가 정상적으로 로드된다', async ({ page }) => {
    await expect(page.locator('.header h1')).toBeVisible();
    await expect(page.locator('#add-project-form')).toBeVisible();
  });

  test('모바일에서 프로젝트를 추가하고 보드를 확인할 수 있다', async ({ page }) => {
    await page.fill('#inp-name', '모바일 테스트');
    await page.getByRole('button', { name: '프로젝트 추가' }).click();

    await expect(page.locator('#board-proj-name')).toContainText('모바일 테스트');
    await expect(page.locator('.phase-block').first()).toBeVisible();
  });
});

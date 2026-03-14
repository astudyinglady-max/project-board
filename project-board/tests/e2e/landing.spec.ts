import { test, expect } from '@playwright/test';

test.describe('랜딩 페이지', () => {
  test('페이지가 정상적으로 로드된다', async ({ page }) => {
    await page.goto('/project-board.html');
    await expect(page).toHaveTitle(/claude-code-kit/);
  });

  test('hero 섹션이 표시된다', async ({ page }) => {
    await page.goto('/project-board.html');
    await expect(page.locator('.hero-badge')).toBeVisible();
    await expect(page.locator('.hero h1')).toBeVisible();
  });

  test('네비게이션 링크가 모두 존재한다', async ({ page }) => {
    await page.goto('/project-board.html');
    await expect(page.locator('nav a[href="#features"]')).toBeVisible();
    await expect(page.locator('nav a[href="#how"]')).toBeVisible();
    await expect(page.locator('nav a[href="#install"]')).toBeVisible();
  });

  test('앵커 클릭 시 해당 섹션으로 스크롤된다', async ({ page }) => {
    await page.goto('/project-board.html');
    await page.click('a[href="#features"]');
    await expect(page.locator('#features')).toBeInViewport();
  });

  test('복사 버튼이 존재한다', async ({ page }) => {
    await page.goto('/project-board.html');
    await expect(page.locator('.copy-btn').first()).toBeVisible();
  });
});

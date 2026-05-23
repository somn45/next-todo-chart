import { test, expect } from "@playwright/test";

test("홈 페이지에서 대시보드로 이동", async ({ page }) => {
  await page.goto("http://localhost:3000");

  await page.getByText("대시보드 접속").click();
  await page.waitForURL("http://localhost:3000/dashboard");

  await expect(page).toHaveURL("http://localhost:3000/dashboard");
});

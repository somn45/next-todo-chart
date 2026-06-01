import { test, expect } from "@playwright/test";

test("DAT 테스트", async ({ page }) => {
  await page.goto("http://localhost:3000/stats?tl=week&da=week");
  const graph = page.getByTestId("daily-active-graph");
  await expect(graph).toBeVisible();

  await test.step("DAT snapshot", async () => {
    await expect(graph).toHaveScreenshot({
      maxDiffPixelRatio: 0.2,
    });
  });

  await test.step("DAT 데이터 포인트 및 axis 검증", async () => {
    const xAxisTickLocator = graph.locator(".xAxis").locator(".tick");
    const xAxisTicks = await xAxisTickLocator.all();
    expect(xAxisTicks).toHaveLength(7);
    expect(xAxisTickLocator.first()).toHaveText("2026-01-11");
    expect(xAxisTickLocator.last()).toHaveText("2026-01-17");

    const lines = await graph.locator(".line").all();
    expect(lines).toHaveLength(4);
  });
});

import { test, expect } from "@playwright/test";

test("DAT 테스트", async ({ page }) => {
  await page.clock.setFixedTime(new Date("2026-01-18"));
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

  await test.step("DAT 마우스 이벤트", async () => {
    const eventArea = graph.getByTestId("event-area");
    await expect(eventArea).toBeVisible();

    const focus = graph.getByTestId("focus");
    const tooltip = graph.getByTestId("tooltip");
    await expect(focus).toHaveCSS("opacity", "0");
    await expect(tooltip).toHaveCSS("opacity", "0");

    await eventArea.hover({
      position: { x: 100, y: 100 },
    });

    await expect(focus).toHaveCSS("opacity", "1");
    await expect(tooltip).toHaveCSS("opacity", "1");
  });
});

test("TL 테스트", async ({ page }) => {
  await page.clock.setFixedTime(new Date("2026-01-18"));
  await page.goto("http://localhost:3000/stats?tl=week&da=week");
  const timeline = page.getByTestId("timeline-graph");
  await expect(timeline).toBeVisible();

  await test.step("TL snapshot", async () => {
    await expect(timeline).toHaveScreenshot({
      maxDiffPixelRatio: 0.2,
    });
  });

  await test.step("TL 데이터 포인트 밑 axis 검증", async () => {
    const xAxisTickLocator = timeline.locator(".xAxis").locator(".tick");
    const xAxisTicks = await xAxisTickLocator.all();

    expect(xAxisTicks).toHaveLength(7);
    expect(xAxisTickLocator.first()).toHaveText("2026-01-18");
    expect(xAxisTickLocator.last()).toHaveText("2026-01-24");

    const bands = await timeline.locator(".band").all();
    expect(bands).toHaveLength(3);
  });
});

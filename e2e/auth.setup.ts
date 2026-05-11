import path from "path";
import { test as setup } from "@playwright/test";

const authFile = path.join(__dirname, "../playwright/.auth/user.json");

setup("auth", async ({ page }) => {
  await page.goto("http://localhost:3000/login");

  await page
    .getByPlaceholder("회원 아이디")
    .fill(process.env.NEXT_PUBLIC_TEST_ID || "");
  await page
    .getByPlaceholder("비밀번호")
    .fill(process.env.NEXT_PUBLIC_TEST_PASSWORD || "");
  await page.getByRole("button", { name: "로그인" }).click();

  await page.waitForURL("http://localhost:3000");

  await page.context().storageState({ path: authFile });
});

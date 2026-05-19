import { test, expect } from "@playwright/test";

test.beforeEach(async ({ request }) => {
  await request.delete("http://localhost:3000/api/test/todos");
});

test("투두 생성 => 수정 => 삭제", async ({ page }) => {
  const newTodo = crypto.randomUUID();
  const editedTodo = crypto.randomUUID();

  await page.goto("http://localhost:3000/todos");
  await page.reload({ waitUntil: "networkidle" });

  await test.step("할 일 생성", async () => {
    await page.getByPlaceholder("새 투두리스트 추가").fill(newTodo);
    await page.getByRole("button", { name: "새 투두 추가" }).click();

    const todoList = page.getByRole("list", { name: "투두 목록" });
    await expect(todoList.getByText(newTodo)).toBeVisible();
  });

  await test.step("할 일 수정", async () => {
    const todoItem = page.getByRole("listitem").filter({ hasText: newTodo });
    await todoItem.getByRole("button", { name: "투두 수정" }).click();
    const editTodoForm = page.getByRole("form", { name: "투두 수정 폼" });
    await expect(editTodoForm).toBeVisible();

    await editTodoForm.getByPlaceholder("투두리스트 수정").fill(editedTodo);
    await editTodoForm.getByRole("button", { name: "수정" }).click();

    await expect(editTodoForm).not.toBeVisible();
    const todoList = page.getByRole("list", { name: "투두 목록" });

    await expect(todoList.getByTestId(newTodo)).not.toBeVisible();
    await expect(todoList.getByText(editedTodo)).toBeVisible();
  });

  await test.step("할 일 삭제", async () => {
    const todoItem = page.getByRole("listitem").filter({ hasText: editedTodo });
    await expect(todoItem).toBeVisible();

    await todoItem.locator("button:has(.lucide-trash)").click();

    await expect(
      page.getByRole("listitem").filter({ hasText: editedTodo }),
    ).not.toBeVisible();
  });
});

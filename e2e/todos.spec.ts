import { StateType } from "@/types/todos/schema";
import { test, expect } from "@playwright/test";

test.beforeEach(async ({ request }) => {
  const response = await request.delete("http://localhost:3000/api/test/todos");
  const json = await response.json();
  expect(response.status()).toBe(200);
  expect(json.message).toBe("모든 투두 삭제 완료");
});

test("투두 생성 => 수정 => 상태 변경 => 삭제", async ({ page }) => {
  const newTodo = crypto.randomUUID();
  const editedTodo = crypto.randomUUID();

  await page.goto("http://localhost:3000/todos");
  await page.reload();

  await test.step("할 일 생성", async () => {
    const addTodoInput = page.getByPlaceholder(/새 투두리스트 추가/);
    await addTodoInput.fill(newTodo);
    await page.getByRole("button", { name: "새 투두 추가" }).click();

    const todoList = page.getByRole("list", { name: "투두 목록" });
    await expect(todoList.getByText(newTodo)).toBeVisible();
    await expect(addTodoInput).toHaveValue("");
  });

  await test.step("할 일 수정", async () => {
    const todoItem = page.getByRole("listitem").filter({ hasText: newTodo });
    const openEditFormButton = todoItem.getByRole("button", {
      name: "투두 수정",
    });
    await expect(openEditFormButton).toBeVisible();
    await expect(openEditFormButton).toBeEnabled();

    await openEditFormButton.click();

    const editTodoForm = page.getByRole("form", { name: "투두 수정 폼" });
    await expect(editTodoForm).toBeVisible();

    const editTodoInput = editTodoForm.getByPlaceholder("투두리스트 수정");
    expect(editTodoInput).toBeVisible();
    await editTodoInput.fill(editedTodo);

    const submitButton = editTodoForm.getByRole("button", {
      name: "수정",
      exact: true,
    });
    await expect(submitButton).toBeEnabled();

    await submitButton.click();

    await expect(editTodoForm).not.toBeVisible();
    const todoList = page.getByRole("list", { name: "투두 목록" });

    await expect(todoList.getByText(editedTodo)).toBeVisible({
      timeout: 15000,
    });
  });

  await test.step("할 일 상태 변경", async () => {
    const todoItem = page.getByRole("listitem").filter({ hasText: editedTodo });

    const todoStates: Array<StateType> = ["할 일", "진행 중", "완료"];
    const updateStateTarget = "진행 중";
    const stateTargetButton = todoItem.getByRole("button", {
      name: updateStateTarget,
    });
    await stateTargetButton.click();

    await expect(stateTargetButton).toHaveClass(/bg-\[#FFA500\]/);

    for (const state of todoStates) {
      const stateButton = todoItem.getByRole("button", {
        name: state,
      });
      if (updateStateTarget === state) {
        await expect(stateButton).toHaveClass(/bg-\[#FFA500\]/);
      } else {
        await expect(stateButton).toHaveClass(/bg-bg-disabled/);
      }
    }
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

test("할 일 생성 => 할 일의 상태를 완료로 변경 => 목록에서 제거 전 유예 시간 10분 할당 => 10분 후 해당 할 일은 목록에서 제거", async ({
  page,
}) => {
  const newTodo = crypto.randomUUID();

  await page.clock.install({ time: new Date("2025-05-25T08:00:00") });
  await page.goto("http://localhost:3000/todos");
  await test.step("할 일 생성", async () => {
    const addTodoInput = page.getByPlaceholder(/새 투두리스트 추가/);
    await addTodoInput.fill(newTodo);
    await page.getByRole("button", { name: "새 투두 추가" }).click();

    const todoList = page.getByRole("list", { name: "투두 목록" });
    await expect(todoList.getByText(newTodo)).toBeVisible();
    await expect(addTodoInput).toHaveValue("");
  });

  await test.step("할 일의 상태 완료로 변경", async () => {
    const todoItem = page.getByRole("listitem").filter({ hasText: newTodo });
    const stateDoneButton = todoItem.getByRole("button", { name: "완료" });
    await stateDoneButton.click();

    const stateButton = todoItem.getByRole("button", { name: "완료" });

    await expect(stateButton).toHaveClass(/bg-\[#2ECC71\]/);

    const graceTimeMessage = todoItem.getByText(/이 할 일은 완료 상태입니다./);
    await expect(graceTimeMessage).toBeVisible();
  });

  await test.step("삭제 유예 시간인 10분이 지난 후 투두 삭제 혹인", async () => {
    await page.clock.fastForward("10:05");
    await expect(page.getByText(newTodo)).not.toBeVisible();
  });
});

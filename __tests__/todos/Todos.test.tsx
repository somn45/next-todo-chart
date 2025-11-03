import Todos from "@/app/(private)/todos/page";
import { ITodo } from "@/types/schema";
import { render } from "@testing-library/react";
import { WithId } from "mongodb";
import nextCache from "next/cache";

jest.mock("@/app/(private)/todos/Form", () => {
  return function MockTodosForm({ userid }: { userid: string }) {
    return <div>`${userid} Todos Form`</div>;
  };
});

jest.mock("@/app/(private)/todos/Todo", () => {
  return function MockTodoPage({ _id, userid }: WithId<ITodo>) {
    return <div>`Todo ${_id.toString()} Page`</div>;
  };
});

const mock = jest.spyOn(nextCache, "unstable_cache");

describe("<Todos />", () => {
  it("Todos 페이지에 접속할 때 getTodos API를 통해 todos를 가져오고 페이지에 출력된다.", async () => {
    const TodosServerComponent = await Todos();
    render(TodosServerComponent);
  });
});

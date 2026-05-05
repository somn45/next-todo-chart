import Dashboard from "@/app/(private)/dashboard/layout";
import { render, screen } from "@testing-library/react";

describe("Dashboard Layout 컴포넌트", () => {
  it("@todos 슬롯과 @graph 슬롯 모두 layout 컴포넌트 페이지에 포함되어 있다..", () => {
    const { container } = render(
      <Dashboard
        todos={<div data-testid="todos-slot">Todos 슬롯</div>}
        graph={<div data-testid="graph-slot">Graph 슬롯</div>}
      >
        <div data-testid="dashboard-page">Dashboard 페이지</div>
      </Dashboard>,
    );

    expect(container).toMatchInlineSnapshot(`
      <div>
        <section
          class="flex w-full flex-col gap-20 pt-8 lg:flex-row lg:justify-center lg:gap-60"
        >
          <section
            class="flex flex-col items-stretch gap-5 p-2.5 lg:w-112.5"
          >
            <div
              data-testid="todos-slot"
            >
              Todos 슬롯
            </div>
          </section>
          <section
            class="flex flex-col items-stretch gap-5 p-2.5 lg:w-112.5"
          >
            <div
              data-testid="graph-slot"
            >
              Graph 슬롯
            </div>
          </section>
          <div
            data-testid="dashboard-page"
          >
            Dashboard 페이지
          </div>
        </section>
      </div>
    `);
  });
});

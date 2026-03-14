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
    style="display: flex;"
  >
    <section
      style="width: 50%; margin-left: 100px; align-self: stretch; display: flex; flex-direction: column;"
    >
      <div
        data-testid="todos-slot"
      >
        Todos 슬롯
      </div>
    </section>
    <section
      style="width: 50%; align-self: stretch; display: flex; flex-direction: column;"
    >
      <div
        data-testid="graph-slot"
      >
        Graph 슬롯
      </div>
    </section>
    <div>
      <div
        data-testid="dashboard-page"
      >
        Dashboard 페이지
      </div>
    </div>
  </section>
</div>
`);
  });
});

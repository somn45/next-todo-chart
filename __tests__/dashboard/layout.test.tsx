import Dashboard from "@/app/(private)/dashboard/layout";
import { render, screen } from "@testing-library/react";

describe("Dashboard Layout 컴포넌트", () => {
  it("@todos 슬롯과 @graph 슬롯 모두 layout 컴포넌트 페이지에 포함되어 있어야 한다.", () => {
    render(
      <Dashboard
        todos={<div data-testid="todos-slot">Todos 슬롯</div>}
        graph={<div data-testid="graph-slot">Graph 슬롯</div>}
      >
        <div data-testid="dashboard-page">Dashboard 페이지</div>
      </Dashboard>,
    );

    const dashboardPage = screen.getByTestId("dashboard-page");
    const todosSlot = screen.getByTestId("todos-slot");
    const graphSlot = screen.getByTestId("graph-slot");

    expect(dashboardPage).toBeInTheDocument();
    expect(todosSlot).toBeInTheDocument();
    expect(graphSlot).toBeInTheDocument();

    expect(dashboardPage).toHaveTextContent("Dashboard 페이지");
    expect(todosSlot).toHaveTextContent("Todos 슬롯");
    expect(graphSlot).toHaveTextContent("Graph 슬롯");
  });
});

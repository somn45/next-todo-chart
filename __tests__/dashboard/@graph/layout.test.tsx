import DashboardGraphLayout from "@/app/(private)/dashboard/@graph/layout";
import { render, screen } from "@testing-library/react";

describe("Dashboard @graph Layout 컴포넌트", () => {
  const testCases = [
    {
      text: "라인 그래프",
      linkHref: "/dashboard/line-graph",
    },
    {
      text: "타임라인",
      linkHref: "/dashboard/timeline",
    },
  ];

  test.each(testCases)(
    "$text 링크 클릭 시 $linkHref 경로로 이동한다",
    ({ text, linkHref }) => {
      render(
        <DashboardGraphLayout>
          <div data-testid="dashboard-graph-page"></div>
        </DashboardGraphLayout>,
      );

      const link = screen.getByRole("link", { name: text });
      expect(link).toHaveAttribute("href", linkHref);
    },
  );
});

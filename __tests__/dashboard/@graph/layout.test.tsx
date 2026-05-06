import DashboardGraphLayout from "@/app/(private)/dashboard/@graph/layout";
import { render, screen } from "@testing-library/react";

jest.mock("@/hooks/useQueryString", () => ({
  __esModule: true,
  default: jest.fn(() => "/stats?tl=week&da=week"),
}));

describe("Dashboard @graph Layout 컴포넌트", () => {
  const testCases = [
    {
      text: "라인 스파크라인 표시",
      linkHref: "/dashboard/line-graph",
    },
    {
      text: "밴드 스파크라인 표시",
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

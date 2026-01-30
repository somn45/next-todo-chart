import TabMenu from "@/app/(private)/stats/@timeline/StatsTabMenu";
import { render, screen } from "@testing-library/react";

jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn().mockReturnValue({
    get: jest.fn().mockReturnValue("week"),
  }),
}));
jest.mock("@/hooks/useQueryString", () => ({
  __esModule: true,
  default: jest.fn(() => "/stats?tl=week&da=week"),
}));

describe("<TabMenu />", () => {
  beforeEach(() => {
    render(<TabMenu />);
  });
  const tabMenuItems = [
    {
      text: "1 주",
      linkHref: "/stats?tl=week&da=week",
    },
    {
      text: "1 달",
      linkHref: "/stats?tl=month&da=week",
    },
    {
      text: "1 년",
      linkHref: "/stats?tl=year&da=week",
    },
  ];
  it.each(tabMenuItems)(
    "%s 이름으로 된 탭 메뉴는 %s 경로로 이동해야 한다.",
    ({ text, linkHref }) => {
      const link = screen.getByRole("link", { name: text });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", linkHref);
    },
  );
});

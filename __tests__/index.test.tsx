import Home from "@/app/page";
import { render, screen } from "@testing-library/react";

describe("<Home />", () => {
  it("서버 컴포넌트 특정 요소 찾기 테스트", async () => {
    const HomeComponent = await Home();
    render(HomeComponent);
    const title = screen.getByRole("heading", { level: 1 });
    expect(title).toBeInTheDocument();
  });
});

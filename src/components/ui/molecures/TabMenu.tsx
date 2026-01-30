"use client";

import NavLink from "../atoms/NavLink";
import useQueryString from "@/hooks/useQueryString";

export interface NavLinkAttr {
  href: string;
  content: string;
}

interface TabMenuProps {
  tabMenuItems: NavLinkAttr[];
}

/**
 * 관심사가 같은 페이지의 내용을 전환할 때 사용
 * 현재 활성화된 탭메뉴는 스타일 강조 표시가 추가된다.
 *
 */
export default function TabMenu({ tabMenuItems }: TabMenuProps) {
  const url = useQueryString();

  return (
    <nav>
      <ul style={{ display: "flex", gap: "20px", listStyleType: "none" }}>
        {tabMenuItems.map(({ href, content }) => (
          <li
            key={content}
            style={{
              fontWeight: url === href ? "600" : "400",
            }}
          >
            <NavLink href={href} content={content} />
          </li>
        ))}
      </ul>
    </nav>
  );
}

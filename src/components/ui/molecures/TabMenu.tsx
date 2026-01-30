"use client";

import { TabMenuItem } from "@/types/ui";
import NavLink from "../atoms/NavLink";

interface TabMenuProps {
  tabMenuItems: TabMenuItem[];
}

/**
 * 관심사가 같은 페이지의 내용을 전환할 때 사용
 * 현재 활성화된 탭메뉴는 스타일 강조 표시가 추가된다.
 *
 */
export default function TabMenu({ tabMenuItems }: TabMenuProps) {
  return (
    <nav>
      <ul style={{ display: "flex", gap: "20px", listStyleType: "none" }}>
        {tabMenuItems.map(({ href, content, isActive }) => (
          <li
            key={content}
            style={{
              fontWeight: isActive ? "600" : "400",
            }}
          >
            <NavLink href={href} content={content} />
          </li>
        ))}
      </ul>
    </nav>
  );
}

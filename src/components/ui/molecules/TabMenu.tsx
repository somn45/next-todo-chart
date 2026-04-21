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
      <ul className="flex list-none gap-5 py-2">
        {tabMenuItems.map(({ href, content, isActive }) => (
          <li
            key={content}
            className={
              isActive
                ? "bg-2nd-light text-text-dark w-16 rounded-md px-4 py-1 text-center font-semibold"
                : "bg-bg-disabled hover:bg-1st-light text-text-disabled hover:text-text-dark w-16 rounded-md px-4 py-1 text-center font-normal hover:font-semibold"
            }
          >
            <NavLink href={href} content={content} />
          </li>
        ))}
      </ul>
    </nav>
  );
}

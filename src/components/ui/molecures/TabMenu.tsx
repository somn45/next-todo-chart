"use client";

import { usePathname, useSearchParams } from "next/navigation";
import NavLink from "../atoms/NavLink";
import { useEffect, useMemo, useState } from "react";

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
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [queryString, setQueryString] = useState("");

  const url = `${pathname}${queryString}`;

  useEffect(() => {
    let queryParams: string[] = [];
    for (const key of searchParams.keys()) {
      const resultOfGetSearchParams = searchParams.get(key) ?? "";
      queryParams = [...queryParams, `${key}=${resultOfGetSearchParams}`];
    }
    const queryString = queryParams.join("&")
      ? `?${queryParams.join("&")}`
      : "";
    setQueryString(queryString);
  }, searchParams.values().toArray());

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

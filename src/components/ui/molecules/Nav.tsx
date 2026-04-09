import { NavLinkItem } from "@/types/ui";
import NavLink from "../atoms/NavLink";

interface NavProps {
  NavLinks: NavLinkItem[];
}

// 단순 다른 경로로 이동
export default function Nav({ NavLinks }: NavProps) {
  return (
    <nav className="h-full w-full">
      <ul className="flex h-full w-full list-none items-center justify-between gap-5 px-8">
        {NavLinks.map(({ href, content }) => (
          <li key={content}>
            <NavLink href={href} content={content} />
          </li>
        ))}
      </ul>
    </nav>
  );
}

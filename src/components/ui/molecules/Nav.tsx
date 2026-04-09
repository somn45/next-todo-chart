import { NavLinkItem } from "@/types/ui";
import NavLink from "../atoms/NavLink";

interface NavProps {
  NavLinks: NavLinkItem[];
  variant?: "default" | "header";
}

// 단순 다른 경로로 이동
export default function Nav({ NavLinks, variant = "default" }: NavProps) {
  const navVariants: { [key: string]: string } = {
    default: "",
    header: "w-full h-full",
  };

  const listVariants: { [key: string]: string } = {
    default: "px-8 py-4",
    header: "w-full h-full px-4",
  };

  const listitemVariants: { [key: string]: string } = {
    default: "",
    header: "w-full h-full flex justify-center items-center",
  };

  return (
    <nav className={navVariants[variant]}>
      <ul
        className={`${listVariants[variant]} flex list-none items-center justify-between gap-5`}
      >
        {NavLinks.map(({ href, content }) => (
          <li
            key={content}
            className={`${listitemVariants[variant]} text-1st-light text-base font-semibold hover:underline`}
          >
            <NavLink href={href} content={content} />
          </li>
        ))}
      </ul>
    </nav>
  );
}

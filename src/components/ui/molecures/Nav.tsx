import NavLink from "../atoms/NavLink";

export interface NavLinkAttr {
  href: string;
  content: string;
}

interface NavProps {
  NavLinks: NavLinkAttr[];
}

// 단순 다른 경로로 이동
export default function Nav({ NavLinks }: NavProps) {
  return (
    <nav>
      <ul style={{ display: "flex", gap: "20px", listStyleType: "none" }}>
        {NavLinks.map(({ href, content }) => (
          <li key={content}>
            <NavLink href={href} content={content} />
          </li>
        ))}
      </ul>
    </nav>
  );
}

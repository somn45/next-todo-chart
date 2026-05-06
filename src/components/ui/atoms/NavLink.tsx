import { NavLinkItem } from "@/types/ui";
import Link from "next/link";

export default function NavLink({ href, content, label }: NavLinkItem) {
  return (
    <Link href={href} aria-label={label}>
      {content}
    </Link>
  );
}

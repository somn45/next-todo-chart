import { NavLinkItem } from "@/types/ui";
import Link from "next/link";

export default function NavLink({ href, content }: NavLinkItem) {
  return <Link href={href}>{content}</Link>;
}

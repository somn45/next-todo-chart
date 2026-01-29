import Link from "next/link";

interface NavLinkProps {
  href: string;
  content: string;
}

export default function NavLink({ href, content }: NavLinkProps) {
  return <Link href={href}>{content}</Link>;
}

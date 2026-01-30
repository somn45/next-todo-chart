export interface NavLinkItem {
  href: string;
  content: string;
}

export interface TabMenuItem extends NavLinkItem {
  isActive: boolean;
}

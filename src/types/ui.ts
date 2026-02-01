export interface NavLinkItem {
  href: string;
  content: string;
}

export interface TabMenuItem extends NavLinkItem {
  isActive: boolean;
}

export interface InputProps {
  type: "text" | "password" | "email";
  name: string;
  ariaLabel: string;
  defaultValue?: string;
  placeholder?: string;
  dataTestId?: string;
  isReadOnly?: boolean;
  isHidden?: boolean;
}

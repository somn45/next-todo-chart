import { NavLinkItem, TabMenuItem } from "@/types/ui";

type getTabMenuItemsType = (
  navLinkItems: NavLinkItem[],
  currentPath: string,
) => TabMenuItem[];

const getTabMenuItems: getTabMenuItemsType = (navLinkItems, currentPath) =>
  navLinkItems.map(navLinkItem => ({
    ...navLinkItem,
    isActive: navLinkItem.href === currentPath,
  }));

export default getTabMenuItems;

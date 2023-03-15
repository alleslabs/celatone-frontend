import type { IconKeys } from "lib/components/icon";

export interface SubmenuInfo {
  name: string;
  slug: string;
  icon?: IconKeys;
  logo?: string;
}

export interface MenuInfo {
  category: string;
  submenu: SubmenuInfo[];
}

export interface NavMenuProps {
  navMenu: MenuInfo[];
  isCurrentPage: (slug: string) => boolean;
  setIsExpand: (value: boolean) => void;
}

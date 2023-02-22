import type { ICONS } from "lib/components/icon/CustomIcon";

export interface SubmenuInfo {
  name: string;
  slug: string;
  icon?: keyof typeof ICONS;
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

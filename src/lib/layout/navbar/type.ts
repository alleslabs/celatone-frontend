import type { IconType } from "react-icons";

export interface SubmenuInfo {
  name: string;
  slug: string;
  icon?: IconType;
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

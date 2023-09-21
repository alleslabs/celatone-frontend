import type { IconKeys } from "lib/components/icon";

export interface SubmenuInfo {
  name: string;
  slug: string;
  icon?: IconKeys;
  logo?: string;
  isDisable?: boolean;
  tooltipText?: string;
  trackEvent?: () => void;
}

export interface SubSection {
  category: string;
  submenu: SubmenuInfo[];
}

export interface MenuInfo {
  category: string;
  slug: string;
  submenu: SubmenuInfo[];
  subSection?: SubSection[];
}

export interface NavMenuProps {
  navMenu: MenuInfo[];
  isCurrentPage: (slug: string) => boolean;
  setIsExpand: (value: boolean) => void;
}

import type { IconKeys } from "lib/components/icon";

export interface MenuInfo {
  category: string;
  slug: string;
  submenu: SubmenuInfo[];
  subSection?: SubSection[];
}

export interface NavMenuProps {
  isCurrentPage: (slug: string) => boolean;
  navMenu: MenuInfo[];
  setIsExpand: (value: boolean) => void;
}

export interface SubmenuInfo {
  icon?: IconKeys;
  isDisable?: boolean;
  logo?: string;
  name: string;
  slug: string;
  tooltipText?: string;
  trackEvent?: () => void;
}

export interface SubSection {
  category: string;
  submenu: SubmenuInfo[];
}

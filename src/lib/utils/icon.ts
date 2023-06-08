import type { IconKeys } from "lib/components/icon";
import { INSTANTIATED_LIST_NAME, SAVED_LIST_NAME } from "lib/data";

export const getListIcon = (listName: string): IconKeys => {
  switch (listName) {
    case INSTANTIATED_LIST_NAME:
      return "wallet";
    case SAVED_LIST_NAME:
      return "bookmark-solid";
    default:
      return "contract-list";
  }
};

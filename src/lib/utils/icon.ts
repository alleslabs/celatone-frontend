import type { IconKeys } from "lib/components/icon";
import { INSTANTIATED_LIST_NAME, SAVED_LIST_NAME } from "lib/data";
import type { Visibility } from "lib/types";

export const getListIcon = (listName: string): IconKeys => {
  switch (listName) {
    case INSTANTIATED_LIST_NAME:
      return "wallet";
    case SAVED_LIST_NAME:
      return "bookmark-solid";
    default:
      return "list";
  }
};

export const getVisibilityIcon = (visibility: Visibility): IconKeys => {
  switch (visibility) {
    case "friend":
      return "friends";
    case "script":
      return "code";
    case "public":
    default:
      return "website";
  }
};

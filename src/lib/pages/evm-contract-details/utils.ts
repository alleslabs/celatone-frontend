import { InteractTabsIndex } from "./types";

export const getInteractTabsIndex = (isRead: boolean, isAsProxy: boolean) => {
  if (isRead)
    return isAsProxy ? InteractTabsIndex.ReadProxy : InteractTabsIndex.Read;
  return isAsProxy ? InteractTabsIndex.WriteProxy : InteractTabsIndex.Write;
};

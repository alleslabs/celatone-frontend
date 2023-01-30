import type { Filters } from "lib/types";
import { MsgFurtherAction } from "lib/types";

export const getMsgFurtherAction = (length: number, filters: Filters) => {
  // Redo: instantiate, execute, check length === 1
  if (length === 1 && (filters.isExecute || filters.isInstantiate)) {
    return MsgFurtherAction.REDO;
  }
  // Resend: messages with execute, instantiate, or send
  if (
    !filters.isClearAdmin &&
    !filters.isUpload &&
    !filters.isIbc &&
    !filters.isClearAdmin &&
    !filters.isMigrate &&
    !filters.isUpdateAdmin &&
    (filters.isExecute || filters.isInstantiate || filters.isSend)
  ) {
    return MsgFurtherAction.RESEND;
  }
  return MsgFurtherAction.NONE;
};

import type { Option } from "lib/types";

import { ActionMsgType } from "lib/types";

export const extractMsgType = (typePath: string): string =>
  typePath.split(".").pop() || "";

/**
 * Returns what action type to be render.
 *
 * @remarks
 * OTHER_ACTION_MSG = message that celatone does not support, happen when msgTypesSupportList contains all false
 * SINGLE_ACTION_MSG = message that celatone support, but contain only 1 message action type, happen when msgTypesSupportList contains only 1 true
 * MULTIPLE_ACTION_MSG = message that celatone support, but contain multiple message action types. happen when msgTypesSupportList contains multiple true
 *
 * @example
 * Given 3 supported action type [execute, instantiate, upload]
 * return OTHER_ACTION_MSG -> [false, false, false]
 * return SINGLE_ACTION_MSG -> [true, false, false]
 * return MULTIPLE_ACTION_MSG -> [true, true, false]
 *
 * @param msgTypesSupportList - list of boolean of message type that celatone supported
 * @returns Returns action type
 *
 *
 *
 */
export const getActionMsgType = (msgTypesSupportList: Option<boolean>[]) => {
  const existLength = msgTypesSupportList.filter((type) => type).length;
  if (existLength === 0) return ActionMsgType.OTHER_ACTION_MSG;
  if (existLength === 1) return ActionMsgType.SINGLE_ACTION_MSG;
  return ActionMsgType.MULTIPLE_ACTION_MSG;
};

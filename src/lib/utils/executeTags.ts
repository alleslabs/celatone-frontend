import type { DetailExecute, Message, Option } from "lib/types";

/**
 * Returns execute tags to be displayed.
 *
 * @param messages - list of messages
 * @param max - number of execute tags to be shown
 * @returns array of execute tags.
 *
 * @example
 * List of messages containing 4 execute message with amount equal to 2
 * Will return ["exec1", "exec2", "+2"]
 */
export const getExecuteMsgTags = (
  messages: Message[],
  max: number
): Option<string>[] => {
  const executeMessages = messages.filter(
    (message) => message.type === "/cosmwasm.wasm.v1.MsgExecuteContract"
  );
  const tags: Option<string>[] = [];
  for (let i = 0; i < max; i += 1) {
    if (executeMessages[i]) {
      const msg = executeMessages[i].detail as DetailExecute;
      tags.push(Object.keys(msg.msg)[0]);
    }
  }

  return executeMessages.length > tags.length
    ? tags.concat(`+${executeMessages.length - tags.length}`)
    : tags;
};

import type { Message } from "lib/types";

/**
 * Returns execute tags to be displayed.
 *
 * @param messages - list of messages
 * @param isShowMore - number of execute tags to be shown
 * @returns array of execute tags.
 *
 * @example
 * List of messages containing 4 execute message with amount eqaul to 2
 * Will return ["exec1", "exec2", "+2"]
 */
export const getExecuteMsgTags = (
  messages: Message[],
  amount: number
): string[] => {
  const executeMessages = messages.filter(
    (message) => message.type === "/cosmwasm.wasm.v1.MsgExecuteContract"
  );
  const tags = [];
  executeMessages.forEach((message, index: number) => {
    if (index < amount) {
      tags.push(Object.keys(message.msg.msg)[0]);
    }
  });

  if (tags.length < executeMessages.length) {
    tags.push(`+${executeMessages.length - tags.length} `);
  }
  return tags;
};

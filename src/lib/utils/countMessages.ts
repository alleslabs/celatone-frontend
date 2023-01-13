import type { Message } from "lib/types";

import { extractMsgType } from "./extractMsgType";

const supportedMessage = [
  "MsgExecuteContract",
  "MsgInstantiateContract",
  "MsgStoreCode",
  "MsgSend",
  "MsgMigrateContract",
  "MsgClearAdmin",
  "MsgUpdateAdmin",
];

const countUnsupportedMessage = (messages: Message[]) =>
  messages.reduce(
    (count, current) =>
      !supportedMessage.includes(extractMsgType(current.type))
        ? count + 1
        : count,
    0
  );

const countMessage = (messages: Message[], type: string) =>
  messages.reduce(
    (count, current) =>
      extractMsgType(current.type) === type ? count + 1 : count,
    0
  );

export const countMessages = (messages: Message[]) => [
  {
    type: "Execute",
    count: countMessage(messages, "MsgExecuteContract"),
  },
  {
    type: "Instantiate",
    count: countMessage(messages, "MsgInstantiateContract"),
  },
  {
    type: "Upload",
    count: countMessage(messages, "MsgStoreCode"),
  },
  {
    type: "Send",
    count: countMessage(messages, "MsgSend"),
  },
  {
    type: "Migrate",
    count: countMessage(messages, "MsgMigrateContract"),
  },
  {
    type: "Clear Admin",
    count: countMessage(messages, "MsgClearAdmin"),
  },
  {
    type: "Update Admin",
    count: countMessage(messages, "MsgUpdateAdmin"),
  },
  {
    type: "Message",
    count: countUnsupportedMessage(messages),
  },
];

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

const getUnSupportedMessageCount = (messages: Message[]) =>
  messages.reduce(
    (count, current) =>
      !supportedMessage.includes(extractMsgType(current.type))
        ? count + 1
        : count,
    0
  );

const getMessageCount = (messages: Message[], type: string) =>
  messages.reduce(
    (count, current) =>
      extractMsgType(current.type) === type ? count + 1 : count,
    0
  );

export const countMessages = (messages: Message[]) => [
  {
    count: getMessageCount(messages, "MsgExecuteContract"),
    type: "Execute",
  },
  {
    count: getMessageCount(messages, "MsgInstantiateContract"),
    type: "Instantiate",
  },
  {
    count: getMessageCount(messages, "MsgStoreCode"),
    type: "Upload",
  },
  {
    count: getMessageCount(messages, "MsgSend"),
    type: "Send",
  },
  {
    count: getMessageCount(messages, "MsgMigrateContract"),
    type: "Migrate",
  },
  {
    count: getMessageCount(messages, "MsgClearAdmin"),
    type: "Clear Admin",
  },
  {
    count: getMessageCount(messages, "MsgUpdateAdmin"),
    type: "Update Admin",
  },
  {
    count: getUnSupportedMessageCount(messages),
    type: "Message",
  },
];

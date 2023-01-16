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
    type: "Execute",
    count: getMessageCount(messages, "MsgExecuteContract"),
  },
  {
    type: "Instantiate",
    count: getMessageCount(messages, "MsgInstantiateContract"),
  },
  {
    type: "Upload",
    count: getMessageCount(messages, "MsgStoreCode"),
  },
  {
    type: "Send",
    count: getMessageCount(messages, "MsgSend"),
  },
  {
    type: "Migrate",
    count: getMessageCount(messages, "MsgMigrateContract"),
  },
  {
    type: "Clear Admin",
    count: getMessageCount(messages, "MsgClearAdmin"),
  },
  {
    type: "Update Admin",
    count: getMessageCount(messages, "MsgUpdateAdmin"),
  },
  {
    type: "Message",
    count: getUnSupportedMessageCount(messages),
  },
];

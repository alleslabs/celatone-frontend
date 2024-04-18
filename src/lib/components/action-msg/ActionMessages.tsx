import { Flex, Tag } from "@chakra-ui/react";
import plur from "plur";

import type { Transaction } from "lib/types";
import { ActionMsgType } from "lib/types";
import { extractMsgType } from "lib/utils";

import { MultipleActionsMsg } from "./MultipleActionsMsg";
import { SingleActionMsg } from "./SingleActionMsg";
import { SingleMsg } from "./SingleMsg";

interface ActionMessagesProps {
  transaction: Transaction;
}

const ActionMessagesBody = ({ transaction }: ActionMessagesProps) => {
  if (transaction.actionMsgType === ActionMsgType.SINGLE_ACTION_MSG) {
    return (
      <SingleActionMsg
        messages={transaction.messages}
        type={extractMsgType(transaction.messages[0].type)}
        success={transaction.success}
      />
    );
  }
  if (transaction.actionMsgType === ActionMsgType.MULTIPLE_ACTION_MSG) {
    return <MultipleActionsMsg messages={transaction.messages} />;
  }
  return (
    <SingleMsg
      type={plur("Message", transaction.messages.length)}
      tags={
        transaction.messages.length === 1
          ? [extractMsgType(transaction.messages[0].type).substring(3)]
          : [transaction.messages.length.toString()]
      }
    />
  );
};

export const ActionMessages = ({ transaction }: ActionMessagesProps) => (
  <Flex gap={1} alignItems="center" flexWrap="wrap">
    <ActionMessagesBody transaction={transaction} />
    {transaction.isIbc && (
      <Tag variant="accent-dark" size="sm">
        IBC
      </Tag>
    )}
    {transaction.isOpinit && (
      <Tag variant="teal" size="sm">
        OPInit
      </Tag>
    )}
  </Flex>
);

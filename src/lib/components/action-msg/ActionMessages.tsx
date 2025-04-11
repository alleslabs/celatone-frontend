import type { Transaction } from "lib/types";

import { Flex, Tag } from "@chakra-ui/react";
import { ActionMsgType } from "lib/types";
import { extractMsgType } from "lib/utils";
import plur from "plur";

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
        success={transaction.success}
        type={extractMsgType(transaction.messages[0].type)}
      />
    );
  }
  if (transaction.actionMsgType === ActionMsgType.MULTIPLE_ACTION_MSG) {
    return <MultipleActionsMsg messages={transaction.messages} />;
  }
  return (
    <SingleMsg
      tags={
        transaction.messages.length === 1
          ? [extractMsgType(transaction.messages[0].type).substring(3)]
          : [transaction.messages.length.toString()]
      }
      type={plur("Message", transaction.messages.length)}
    />
  );
};

export const ActionMessages = ({ transaction }: ActionMessagesProps) => (
  <Flex alignItems="center" flexWrap="wrap" gap={1}>
    <ActionMessagesBody transaction={transaction} />
    {transaction.isIbc && (
      <Tag size="sm" variant="secondary">
        IBC
      </Tag>
    )}
    {transaction.isOpinit && (
      <Tag size="sm" variant="teal">
        OPInit
      </Tag>
    )}
    {transaction.isEvm && (
      <Tag size="sm" variant="primary-light">
        EVM
      </Tag>
    )}
  </Flex>
);

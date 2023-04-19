import type { BlockTransaction, Transaction } from "lib/types";
import { ActionMsgType } from "lib/types";
import { extractMsgType } from "lib/utils";

import { MultipleActionsMsg } from "./MultipleActionsMsg";
import { SingleActionMsg } from "./SingleActionMsg";
import { SingleMsg } from "./SingleMsg";

interface RenderActionMessagesProps {
  transaction: Transaction | BlockTransaction;
}

export const RenderActionMessages = ({
  transaction,
}: RenderActionMessagesProps) => {
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
      type="Message"
      tags={
        transaction.messages.length === 1
          ? [extractMsgType(transaction.messages[0].type).substring(3)]
          : [transaction.messages.length.toString()]
      }
    />
  );
};

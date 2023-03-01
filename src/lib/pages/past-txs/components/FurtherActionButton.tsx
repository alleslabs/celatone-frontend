import { RedoButton, ResendButton } from "lib/components/button";
import { RedoModal } from "lib/components/modal";
import type { Transaction } from "lib/types";
import { MsgFurtherAction } from "lib/types";
import { extractMsgType } from "lib/utils";

interface FurtherActionButtonProps {
  transaction: Transaction;
}

/**
 * Render redo button, resend button, or nothing.
 *
 * @remarks
 * Redo occurs for transaction that has only 1 message
 * Resend should not occurs for instantiate2
 * Redo modal if the message is instantiate2
 *
 */
export const FurtherActionButton = ({
  transaction,
}: FurtherActionButtonProps) => {
  const isInstantiate2 =
    transaction.isInstantiate &&
    transaction.messages.some(
      (msg) => extractMsgType(msg.type) === "MsgInstantiateContract2"
    );

  if (
    transaction.furtherAction === MsgFurtherAction.RESEND &&
    !isInstantiate2
  ) {
    return <ResendButton messages={transaction.messages} />;
  }

  if (transaction.furtherAction === MsgFurtherAction.REDO && isInstantiate2) {
    return <RedoModal message={transaction.messages[0]} />;
  }

  if (transaction.furtherAction === MsgFurtherAction.REDO) {
    return <RedoButton message={transaction.messages[0]} />;
  }

  return null;
};

import { RedoButton } from "lib/components/button/RedoButton";
import { ResendButton } from "lib/components/button/ResendButton";
import type { PastTransaction } from "lib/types";
import { MsgFurtherAction } from "lib/types";

interface FurtherActionButtonProps {
  transaction: PastTransaction;
}

/**
 * Render redo button, resend button, or nothing.
 *
 * @remarks
 * Redo occurs for transaction that has only 1 message
 *
 */
export const FurtherActionButton = ({
  transaction,
}: FurtherActionButtonProps) => {
  if (transaction.furtherAction === MsgFurtherAction.RESEND) {
    return <ResendButton messages={transaction.messages} />;
  }

  if (transaction.furtherAction === MsgFurtherAction.REDO) {
    return <RedoButton message={transaction.messages[0]} />;
  }

  return null;
};

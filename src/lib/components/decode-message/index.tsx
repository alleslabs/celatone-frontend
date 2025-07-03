import type { DecodedMessage } from "@initia/tx-decoder";

import { TxMessage, type TxMsgData } from "../tx-message";
import { DecodeMessageDelegate } from "./decode-message-delegate";
import { DecodeMessageIbcTransfer } from "./decode-message-ibc-transfer";
import { DecodeMessageNftBurn } from "./decode-message-nft-burn";
import { DecodeMessageNftMint } from "./decode-message-nft-mint";
import { DecodeMessageObjectTransfer } from "./decode-message-object-transfer";
import { DecodeMessageOpDeposit } from "./decode-message-op-deposit";
import { DecodeMessageOpFinalizeWithdraw } from "./decode-message-op-finalize-withdraw";
import { DecodedMessageRedelegate } from "./decode-message-redelegate";
import { DecodeMessageSend } from "./decode-message-send";
import { DecodeMessageSwap } from "./decode-message-swap";
import { DecodeMessageUndelegate } from "./decode-message-undelegate";
import { DecodeMessageWithdrawDelegatorReward } from "./decode-message-withdraw-delegator-reward";

interface DecodeMessageProps extends TxMsgData {
  compact: boolean;
  decodedMessage: DecodedMessage;
}

export const DecodeMessage = ({
  decodedMessage,
  ...props
}: DecodeMessageProps) => {
  switch (decodedMessage.action) {
    case "delegate":
      return (
        <DecodeMessageDelegate decodedMessage={decodedMessage} {...props} />
      );
    case "ibc_transfer":
      return (
        <DecodeMessageIbcTransfer decodedMessage={decodedMessage} {...props} />
      );
    case "nft_burn":
      // TODO: Missing nft metadata
      return (
        <DecodeMessageNftBurn decodedMessage={decodedMessage} {...props} />
      );
    case "nft_mint":
      // TODO: Missing nft metadata
      return (
        <DecodeMessageNftMint decodedMessage={decodedMessage} {...props} />
      );
    case "object_transfer":
      // TODO Missing nft metadata
      return (
        <DecodeMessageObjectTransfer
          decodedMessage={decodedMessage}
          {...props}
        />
      );
    case "op_deposit":
      // TODO: Miss rollup id
      return (
        <DecodeMessageOpDeposit decodedMessage={decodedMessage} {...props} />
      );
    case "op_finalize_withdraw":
      // TODO: Miss rollup id
      return (
        <DecodeMessageOpFinalizeWithdraw
          decodedMessage={decodedMessage}
          {...props}
        />
      );
    case "redelegate":
      return (
        <DecodedMessageRedelegate decodedMessage={decodedMessage} {...props} />
      );
    case "send":
      return <DecodeMessageSend decodedMessage={decodedMessage} {...props} />;
    case "swap":
      return <DecodeMessageSwap decodedMessage={decodedMessage} {...props} />;
    case "undelegate":
      return (
        <DecodeMessageUndelegate decodedMessage={decodedMessage} {...props} />
      );
    case "withdraw_delegator_reward":
      return (
        <DecodeMessageWithdrawDelegatorReward
          decodedMessage={decodedMessage}
          {...props}
        />
      );
    default:
      return <TxMessage {...props} />;
  }
};

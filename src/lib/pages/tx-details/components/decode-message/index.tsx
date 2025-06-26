import type { DecodedMessage } from "@initia/tx-decoder";

import { TxMessage, type TxMsgData } from "../tx-message";
import { DecodeMessageNftMint } from "./decode-message-nft-mint";
import { DecodeMessageSend } from "./decode-message-send";
import { DecodeMessageSwap } from "./decode-message-swap";
import { DecodedMessageWithdrawDelegatorReward } from "./decode-message-withdraw-delegator-reward";

interface DecodeMessageProps extends TxMsgData {
  decodedMessage: DecodedMessage;
}

export const DecodeMessage = ({
  decodedMessage,
  ...props
}: DecodeMessageProps) => {
  switch (decodedMessage.action) {
    case "nft_mint":
      return (
        <DecodeMessageNftMint decodedMessage={decodedMessage} {...props} />
      );
    case "send":
      return <DecodeMessageSend decodedMessage={decodedMessage} {...props} />;
    case "swap":
      return <DecodeMessageSwap decodedMessage={decodedMessage} {...props} />;
    case "withdraw_delegator_reward":
      return (
        <DecodedMessageWithdrawDelegatorReward
          decodedMessage={decodedMessage}
          {...props}
        />
      );

    // /initia.move.v1.MsgExecute
    // - <module_address>::usernames::register_domain
    // - 0x1::stableswap::swap_script
    // /opinit.ophost.v1.MsgInitiateTokenDeposit
    // /opinit.ophost.v1.MsgFinalizeTokenWithdrawal
    default:
      return <TxMessage {...props} />;
  }
};

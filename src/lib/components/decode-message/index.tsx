import type { DecodedMessage, Metadata } from "@initia/tx-decoder";

import { TxMessage, type TxMsgData } from "../tx-message";
import { DecodeMessageDelegate } from "./decode-message-delegate";
import { DecodeMessageDepositLiquidity } from "./decode-message-deposit-liquidity";
import { DecodeMessageDepositStakeLiquidity } from "./decode-message-deposit-stake-liquidity";
import { DecodeMessageDepositStakeLockLiquidity } from "./decode-message-deposit-stake-lock-liquidity";
import { DecodeMessageIbcFt } from "./decode-message-ibc-ft";
import { DecodeMessageIbcNft } from "./decode-message-ibc-nft";
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
import { DecodeMessageWithdrawLiquidity } from "./decode-message-withdraw-liquidity";

interface DecodeMessageProps extends TxMsgData {
  compact: boolean;
  decodedMessage: DecodedMessage;
  metadata?: Metadata;
}

export const DecodeMessage = ({
  decodedMessage,
  metadata,
  ...props
}: DecodeMessageProps) => {
  switch (decodedMessage.action) {
    case "delegate":
      return (
        <DecodeMessageDelegate decodedMessage={decodedMessage} {...props} />
      );
    case "deposit_liquidity":
      return (
        <DecodeMessageDepositLiquidity
          decodedMessage={decodedMessage}
          {...props}
        />
      );
    case "deposit_stake_liquidity":
      return (
        <DecodeMessageDepositStakeLiquidity
          decodedMessage={decodedMessage}
          {...props}
        />
      );
    case "deposit_stake_lock_liquidity":
      return (
        <DecodeMessageDepositStakeLockLiquidity
          decodedMessage={decodedMessage}
          {...props}
        />
      );
    case "ibc_ft_receive":
    case "ibc_ft_send":
      return <DecodeMessageIbcFt decodedMessage={decodedMessage} {...props} />;
    case "ibc_nft_receive":
    case "ibc_nft_send":
      return (
        <DecodeMessageIbcNft
          decodedMessage={decodedMessage}
          metadata={metadata}
          {...props}
        />
      );
    case "nft_burn":
      return (
        <DecodeMessageNftBurn decodedMessage={decodedMessage} {...props} />
      );
    case "nft_mint":
      return (
        <DecodeMessageNftMint
          decodedMessage={decodedMessage}
          metadata={metadata}
          {...props}
        />
      );
    case "object_transfer":
      return (
        <DecodeMessageObjectTransfer
          decodedMessage={decodedMessage}
          metadata={metadata}
          {...props}
        />
      );
    case "op_deposit":
      return (
        <DecodeMessageOpDeposit decodedMessage={decodedMessage} {...props} />
      );
    case "op_finalize_withdraw":
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
    case "withdraw_liquidity":
      return (
        <DecodeMessageWithdrawLiquidity
          decodedMessage={decodedMessage}
          {...props}
        />
      );
    default:
      return <TxMessage {...props} />;
  }
};

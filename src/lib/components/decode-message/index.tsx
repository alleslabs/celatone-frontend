import type { DecodedMessage, Metadata } from "@initia/tx-decoder";

import { TxMessage, type TxMsgData } from "../tx-message";
import { DecodeMessageClaimEsinit } from "./decode-message-claim-esinit";
import { DecodeMessageClaimMinitSwap } from "./decode-message-claim-minitswap";
import { DecodeMessageDelegate } from "./decode-message-delegate";
import { DecodeMessageDepositLiquidity } from "./decode-message-deposit-liquidity";
import { DecodeMessageDepositMinitSwap } from "./decode-message-deposit-minitswap";
import { DecodeMessageDepositStableSwap } from "./decode-message-deposit-stableswap";
import { DecodeMessageDepositStakeLiquidity } from "./decode-message-deposit-stake-liquidity";
import { DecodeMessageDepositStakeLockLiquidity } from "./decode-message-deposit-stake-lock-liquidity";
import { DecodeMessageExtendLiquidity } from "./decode-message-extend-liquidity";
import { DecodeMessageGaugeVote } from "./decode-message-gauge-vote";
import { DecodeMessageIbcFt } from "./decode-message-ibc-ft";
import { DecodeMessageIbcNft } from "./decode-message-ibc-nft";
import { DecodeMessageMergeLiquidity } from "./decode-message-merge-liquidity";
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
import { DecodeMessageWithdrawMinitSwap } from "./decode-message-withdraw-minitswap";
import { DecodeMessageWithdrawStableSwap } from "./decode-message-withdraw-stableswap";

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
    case "claim_minitswap":
      return (
        <DecodeMessageClaimMinitSwap
          decodedMessage={decodedMessage}
          {...props}
        />
      );
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
    case "deposit_minitswap":
      return (
        <DecodeMessageDepositMinitSwap
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
    case "extend_liquidity":
      return (
        <DecodeMessageExtendLiquidity
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
    case "merge_liquidity":
      return (
        <DecodeMessageMergeLiquidity
          decodedMessage={decodedMessage}
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
    case "provide_stableswap":
      return (
        <DecodeMessageDepositStableSwap
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
    case "vip_claim_esinit":
      return (
        <DecodeMessageClaimEsinit decodedMessage={decodedMessage} {...props} />
      );
    case "vip_gauge_vote":
      return (
        <DecodeMessageGaugeVote decodedMessage={decodedMessage} {...props} />
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
    case "withdraw_minitswap":
      return (
        <DecodeMessageWithdrawMinitSwap
          decodedMessage={decodedMessage}
          {...props}
        />
      );
    case "withdraw_stableswap":
      return (
        <DecodeMessageWithdrawStableSwap
          decodedMessage={decodedMessage}
          {...props}
        />
      );
    default:
      return <TxMessage {...props} />;
  }
};

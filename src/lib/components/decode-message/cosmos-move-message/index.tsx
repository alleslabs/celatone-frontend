import type { DecodedMessage, Metadata } from "@initia/tx-decoder";

import { lazy, Suspense } from "react";

import { TxMessage, type TxMsgData } from "../../tx-message";

// Lazy load all decode message components for better code splitting
const DecodeMessageClaimEsinit = lazy(() =>
  import("./decode-message-claim-esinit").then((m) => ({
    default: m.DecodeMessageClaimEsinit,
  }))
);
const DecodeMessageClaimMinitSwap = lazy(() =>
  import("./decode-message-claim-minitswap").then((m) => ({
    default: m.DecodeMessageClaimMinitSwap,
  }))
);
const DecodeMessageDelegate = lazy(() =>
  import("./decode-message-delegate").then((m) => ({
    default: m.DecodeMessageDelegate,
  }))
);
const DecodeMessageDepositLiquidity = lazy(() =>
  import("./decode-message-deposit-liquidity").then((m) => ({
    default: m.DecodeMessageDepositLiquidity,
  }))
);
const DecodeMessageDepositMinitSwap = lazy(() =>
  import("./decode-message-deposit-minitswap").then((m) => ({
    default: m.DecodeMessageDepositMinitSwap,
  }))
);
const DecodeMessageDepositStableSwap = lazy(() =>
  import("./decode-message-deposit-stableswap").then((m) => ({
    default: m.DecodeMessageDepositStableSwap,
  }))
);
const DecodeMessageDepositStakeLiquidity = lazy(() =>
  import("./decode-message-deposit-stake-liquidity").then((m) => ({
    default: m.DecodeMessageDepositStakeLiquidity,
  }))
);
const DecodeMessageDepositStakeLockLiquidity = lazy(() =>
  import("./decode-message-deposit-stake-lock-liquidity").then((m) => ({
    default: m.DecodeMessageDepositStakeLockLiquidity,
  }))
);
const DecodeMessageExtendLiquidity = lazy(() =>
  import("./decode-message-extend-liquidity").then((m) => ({
    default: m.DecodeMessageExtendLiquidity,
  }))
);
const DecodeMessageGaugeVote = lazy(() =>
  import("./decode-message-gauge-vote").then((m) => ({
    default: m.DecodeMessageGaugeVote,
  }))
);
const DecodeMessageIbcFt = lazy(() =>
  import("./decode-message-ibc-ft").then((m) => ({
    default: m.DecodeMessageIbcFt,
  }))
);
const DecodeMessageIbcNft = lazy(() =>
  import("./decode-message-ibc-nft").then((m) => ({
    default: m.DecodeMessageIbcNft,
  }))
);
const DecodeMessageMergeLiquidity = lazy(() =>
  import("./decode-message-merge-liquidity").then((m) => ({
    default: m.DecodeMessageMergeLiquidity,
  }))
);
const DecodeMessageNftBurn = lazy(() =>
  import("./decode-message-nft-burn").then((m) => ({
    default: m.DecodeMessageNftBurn,
  }))
);
const DecodeMessageNftMint = lazy(() =>
  import("./decode-message-nft-mint").then((m) => ({
    default: m.DecodeMessageNftMint,
  }))
);
const DecodeMessageObjectTransfer = lazy(() =>
  import("./decode-message-object-transfer").then((m) => ({
    default: m.DecodeMessageObjectTransfer,
  }))
);
const DecodeMessageOpDeposit = lazy(() =>
  import("./decode-message-op-deposit").then((m) => ({
    default: m.DecodeMessageOpDeposit,
  }))
);
const DecodeMessageOpFinalizeWithdraw = lazy(() =>
  import("./decode-message-op-finalize-withdraw").then((m) => ({
    default: m.DecodeMessageOpFinalizeWithdraw,
  }))
);
const DecodeMessageRedelegate = lazy(() =>
  import("./decode-message-redelegate").then((m) => ({
    default: m.DecodeMessageRedelegate,
  }))
);
const DecodeMessageSend = lazy(() =>
  import("./decode-message-send").then((m) => ({
    default: m.DecodeMessageSend,
  }))
);
const DecodeMessageSwap = lazy(() =>
  import("./decode-message-swap").then((m) => ({
    default: m.DecodeMessageSwap,
  }))
);
const DecodeMessageUndelegate = lazy(() =>
  import("./decode-message-undelegate").then((m) => ({
    default: m.DecodeMessageUndelegate,
  }))
);
const DecodeMessageWithdrawDelegatorReward = lazy(() =>
  import("./decode-message-withdraw-delegator-reward").then((m) => ({
    default: m.DecodeMessageWithdrawDelegatorReward,
  }))
);
const DecodeMessageWithdrawLiquidity = lazy(() =>
  import("./decode-message-withdraw-liquidity").then((m) => ({
    default: m.DecodeMessageWithdrawLiquidity,
  }))
);
const DecodeMessageWithdrawMinitSwap = lazy(() =>
  import("./decode-message-withdraw-minitswap").then((m) => ({
    default: m.DecodeMessageWithdrawMinitSwap,
  }))
);
const DecodeMessageWithdrawStableSwap = lazy(() =>
  import("./decode-message-withdraw-stableswap").then((m) => ({
    default: m.DecodeMessageWithdrawStableSwap,
  }))
);

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
  const renderMessage = () => {
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
        return (
          <DecodeMessageIbcFt decodedMessage={decodedMessage} {...props} />
        );
      case "ibc_nft_receive_move":
      case "ibc_nft_send_move":
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
          <DecodeMessageRedelegate decodedMessage={decodedMessage} {...props} />
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
          <DecodeMessageClaimEsinit
            decodedMessage={decodedMessage}
            {...props}
          />
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

  return (
    <Suspense fallback={<TxMessage {...props} />}>{renderMessage()}</Suspense>
  );
};

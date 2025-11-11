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
const DecodeMessageIbcNftEvm = lazy(() =>
  import("./decode-message-ibc-nft-evm").then((m) => ({
    default: m.DecodeMessageIbcNftEvm,
  }))
);
const DecodeMessageOpFinalizeDeposit = lazy(() =>
  import("./decode-message-op-finalize-deposit").then((m) => ({
    default: m.DecodeMessageOpFinalizeDeposit,
  }))
);
const DecodeMessageOpInitiateWithdraw = lazy(() =>
  import("./decode-message-op-initiate-withdraw").then((m) => ({
    default: m.DecodeMessageOpInitiateWithdraw,
  }))
);
const DecodeMessageCw20Transfer = lazy(() =>
  import("./decode-message-cw20-transfer").then((m) => ({
    default: m.DecodeMessageCw20Transfer,
  }))
);
const DecodeMessageCw20TransferFrom = lazy(() =>
  import("./decode-message-cw20-transfer-from").then((m) => ({
    default: m.DecodeMessageCw20TransferFrom,
  }))
);
const DecodeMessageCw721Transfer = lazy(() =>
  import("./decode-message-cw721-transfer").then((m) => ({
    default: m.DecodeMessageCw721Transfer,
  }))
);
const DecodeMessageCw721Mint = lazy(() =>
  import("./decode-message-cw721-mint").then((m) => ({
    default: m.DecodeMessageCw721Mint,
  }))
);
const DecodeMessageInstantiateContract = lazy(() =>
  import("./decode-message-instantiate-contract").then((m) => ({
    default: m.DecodeMessageInstantiateContract,
  }))
);
const DecodeMessageExecuteContract = lazy(() =>
  import("./decode-message-execute-contract").then((m) => ({
    default: m.DecodeMessageExecuteContract,
  }))
);
const DecodeMessageIbcNftWasm = lazy(() =>
  import("./decode-message-ibc-nft-wasm").then((m) => ({
    default: m.DecodeMessageIbcNftWasm,
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
    const { action } = decodedMessage;

    if (action === "claim_minitswap") {
      return (
        <DecodeMessageClaimMinitSwap
          decodedMessage={decodedMessage}
          {...props}
        />
      );
    }

    if (action === "delegate") {
      return (
        <DecodeMessageDelegate decodedMessage={decodedMessage} {...props} />
      );
    }

    if (action === "deposit_liquidity") {
      return (
        <DecodeMessageDepositLiquidity
          decodedMessage={decodedMessage}
          {...props}
        />
      );
    }

    if (action === "deposit_minitswap") {
      return (
        <DecodeMessageDepositMinitSwap
          decodedMessage={decodedMessage}
          {...props}
        />
      );
    }

    if (action === "deposit_stake_liquidity") {
      return (
        <DecodeMessageDepositStakeLiquidity
          decodedMessage={decodedMessage}
          {...props}
        />
      );
    }

    if (action === "deposit_stake_lock_liquidity") {
      return (
        <DecodeMessageDepositStakeLockLiquidity
          decodedMessage={decodedMessage}
          {...props}
        />
      );
    }

    if (action === "extend_liquidity") {
      return (
        <DecodeMessageExtendLiquidity
          decodedMessage={decodedMessage}
          {...props}
        />
      );
    }

    if (action === "ibc_ft_receive" || action === "ibc_ft_send") {
      return <DecodeMessageIbcFt decodedMessage={decodedMessage} {...props} />;
    }

    if (action === "ibc_nft_receive_evm" || action === "ibc_nft_send_evm") {
      return (
        <DecodeMessageIbcNftEvm decodedMessage={decodedMessage} {...props} />
      );
    }

    if (
      (action === "ibc_nft_receive_move" || action === "ibc_nft_send_move") &&
      metadata?.type === "move"
    ) {
      return (
        <DecodeMessageIbcNft
          decodedMessage={decodedMessage}
          metadata={metadata}
          {...props}
        />
      );
    }

    if (action === "merge_liquidity") {
      return (
        <DecodeMessageMergeLiquidity
          decodedMessage={decodedMessage}
          {...props}
        />
      );
    }

    if (action === "nft_burn") {
      return (
        <DecodeMessageNftBurn decodedMessage={decodedMessage} {...props} />
      );
    }

    if (action === "nft_mint" && metadata?.type === "move") {
      return (
        <DecodeMessageNftMint
          decodedMessage={decodedMessage}
          metadata={metadata}
          {...props}
        />
      );
    }

    if (action === "object_transfer" && metadata?.type === "move") {
      return (
        <DecodeMessageObjectTransfer
          decodedMessage={decodedMessage}
          metadata={metadata}
          {...props}
        />
      );
    }

    if (action === "op_deposit") {
      return (
        <DecodeMessageOpDeposit decodedMessage={decodedMessage} {...props} />
      );
    }

    if (action === "op_finalize_deposit") {
      return (
        <DecodeMessageOpFinalizeDeposit
          decodedMessage={decodedMessage}
          {...props}
        />
      );
    }

    if (action === "op_finalize_withdraw") {
      return (
        <DecodeMessageOpFinalizeWithdraw
          decodedMessage={decodedMessage}
          {...props}
        />
      );
    }

    if (action === "op_initiate_withdraw") {
      return (
        <DecodeMessageOpInitiateWithdraw
          decodedMessage={decodedMessage}
          {...props}
        />
      );
    }

    if (action === "provide_stableswap") {
      return (
        <DecodeMessageDepositStableSwap
          decodedMessage={decodedMessage}
          {...props}
        />
      );
    }

    if (action === "redelegate") {
      return (
        <DecodeMessageRedelegate decodedMessage={decodedMessage} {...props} />
      );
    }

    if (action === "send") {
      return <DecodeMessageSend decodedMessage={decodedMessage} {...props} />;
    }

    if (action === "swap") {
      return <DecodeMessageSwap decodedMessage={decodedMessage} {...props} />;
    }

    if (action === "undelegate") {
      return (
        <DecodeMessageUndelegate decodedMessage={decodedMessage} {...props} />
      );
    }

    if (action === "vip_claim_esinit") {
      return (
        <DecodeMessageClaimEsinit decodedMessage={decodedMessage} {...props} />
      );
    }

    if (action === "vip_gauge_vote") {
      return (
        <DecodeMessageGaugeVote decodedMessage={decodedMessage} {...props} />
      );
    }

    if (action === "withdraw_delegator_reward") {
      return (
        <DecodeMessageWithdrawDelegatorReward
          decodedMessage={decodedMessage}
          {...props}
        />
      );
    }

    if (action === "withdraw_liquidity") {
      return (
        <DecodeMessageWithdrawLiquidity
          decodedMessage={decodedMessage}
          {...props}
        />
      );
    }

    if (action === "withdraw_minitswap") {
      return (
        <DecodeMessageWithdrawMinitSwap
          decodedMessage={decodedMessage}
          {...props}
        />
      );
    }

    if (action === "withdraw_stableswap") {
      return (
        <DecodeMessageWithdrawStableSwap
          decodedMessage={decodedMessage}
          {...props}
        />
      );
    }

    // WASM actions
    if (action === "cw20_transfer") {
      return (
        <DecodeMessageCw20Transfer decodedMessage={decodedMessage} {...props} />
      );
    }

    if (action === "cw20_transfer_from") {
      return (
        <DecodeMessageCw20TransferFrom
          decodedMessage={decodedMessage}
          {...props}
        />
      );
    }

    if (action === "cw721_transfer") {
      return (
        <DecodeMessageCw721Transfer
          decodedMessage={decodedMessage}
          {...props}
        />
      );
    }

    if (action === "cw721_mint") {
      return (
        <DecodeMessageCw721Mint decodedMessage={decodedMessage} {...props} />
      );
    }

    if (action === "instantiate_contract") {
      return (
        <DecodeMessageInstantiateContract
          decodedMessage={decodedMessage}
          {...props}
        />
      );
    }

    if (action === "execute_contract") {
      return (
        <DecodeMessageExecuteContract
          decodedMessage={decodedMessage}
          {...props}
        />
      );
    }

    if (action === "ibc_nft_send_wasm" || action === "ibc_nft_receive_wasm") {
      return (
        <DecodeMessageIbcNftWasm decodedMessage={decodedMessage} {...props} />
      );
    }

    return <TxMessage {...props} />;
  };

  return (
    <Suspense fallback={<TxMessage {...props} />}>{renderMessage()}</Suspense>
  );
};

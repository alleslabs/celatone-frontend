import type { Log } from "@cosmjs/stargate/build/logs";
import type { Message } from "lib/types";

import { extractTxDetails } from "lib/utils";

export const getPoolDenom = (poolId: string) => `gamm/pool/${poolId}`;

export const extractPoolMsgs = (msgs: Message[], poolId: number) => {
  const result: {
    msgs: { index: number; msg: Message }[];
    others: { [key: string]: number };
  } = {
    msgs: [],
    others: {},
  };

  msgs.forEach((msg, index) => {
    // TODO: fix this type casting
    const { detail, log, type } = msg as unknown as {
      detail: Record<string, unknown>;
      log: Log;
      type: string;
    };

    switch (type) {
      case "/cosmos.authz.v1beta1.MsgExec":
      case "/cosmwasm.wasm.v1.MsgExecuteContract":
      case "/cosmwasm.wasm.v1.MsgInstantiateContract1":
      case "/cosmwasm.wasm.v1.MsgInstantiateContract2":
      case "/ibc.core.channel.v1.MsgRecvPacket":
      case "/osmosis.concentratedliquidity.v1beta1.MsgAddToPosition":
      case "/osmosis.concentratedliquidity.v1beta1.MsgCollectIncentives":
      case "/osmosis.concentratedliquidity.v1beta1.MsgCollectSpreadRewards":
      case "/osmosis.concentratedliquidity.v1beta1.MsgCreatePosition":
      case "/osmosis.concentratedliquidity.v1beta1.MsgFungifyChargedPositions":
      case "/osmosis.concentratedliquidity.v1beta1.MsgWithdrawPosition":
      case "/osmosis.lockup.MsgBeginUnlocking":
      case "/osmosis.lockup.MsgBeginUnlockingAll":
      case "/osmosis.lockup.MsgExtendLockup":
      case "/osmosis.lockup.MsgForceUnlock":
      case "/osmosis.lockup.MsgSetRewardReceiverAddress":
      case "/osmosis.poolmanager.v1beta1.MsgSplitRouteSwapExactAmountIn":
      case "/osmosis.poolmanager.v1beta1.MsgSplitRouteSwapExactAmountOut":
      case "/osmosis.superfluid.MsgAddToConcentratedLiquiditySuperfluidPosition":
      case "/osmosis.superfluid.MsgCreateFullRangePositionAndSuperfluidDelegate":
      case "/osmosis.superfluid.MsgLockExistingFullRangePositionAndSFStake":
      case "/osmosis.superfluid.MsgSuperfluidDelegate":
      case "/osmosis.superfluid.MsgSuperfluidUnbondLock":
      case "/osmosis.superfluid.MsgSuperfluidUndelegate":
      case "/osmosis.superfluid.MsgSuperfluidUndelegateAndUnbondLock":
      case "/osmosis.superfluid.MsgUnlockAndMigrateSharesToFullRangeConcentratedPosition":
      case "/osmosis.superfluid.MsgUnPoolWhitelistedPool": {
        result.others[type] =
          (result.others[type] ? result.others[type] : 0) + 1;
        break;
      }
      case "/osmosis.gamm.v1beta1.MsgExitPool":
      case "/osmosis.gamm.v1beta1.MsgExitSwapExternAmountOut":
      case "/osmosis.gamm.v1beta1.MsgExitSwapShareAmountIn":
      case "/osmosis.gamm.v1beta1.MsgJoinPool":
      case "/osmosis.gamm.v1beta1.MsgJoinSwapExternAmountIn":
      case "/osmosis.gamm.v1beta1.MsgJoinSwapShareAmountOut": {
        const details = extractTxDetails(type, detail, log);
        if (Number(details.pool_id) === poolId)
          result.msgs.push({ index, msg });
        break;
      }
      case "/osmosis.gamm.v1beta1.MsgSwapExactAmountIn":
      case "/osmosis.gamm.v1beta1.MsgSwapExactAmountOut":
      case "/osmosis.poolmanager.v1beta1.MsgSwapExactAmountIn":
      case "/osmosis.poolmanager.v1beta1.MsgSwapExactAmountOut": {
        const details = extractTxDetails(type, detail, log);
        if (
          (details.routes as { poolId: number }[]).some(
            (pool) => Number(pool.poolId) === poolId
          )
        )
          result.msgs.push({ index, msg });
        break;
      }
      case "/osmosis.lockup.MsgLockTokens":
      case "/osmosis.superfluid.MsgLockAndSuperfluidDelegate": {
        const details = extractTxDetails(type, detail, log);
        const poolDenom = getPoolDenom(poolId.toString());
        if (details.coins.some((coin) => coin.denom === poolDenom))
          result.msgs.push({ index, msg });
        break;
      }
      default:
        break;
    }
  });
  return result;
};

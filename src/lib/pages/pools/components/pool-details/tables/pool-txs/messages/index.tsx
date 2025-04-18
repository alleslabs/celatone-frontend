import type { Log } from "@cosmjs/stargate/build/logs";
import type { AssetInfos, Message, Option, PoolData } from "lib/types";

import { Text } from "@chakra-ui/react";
import { extractTxDetails } from "lib/utils";

import { MsgLockTokensAction, MsgLockTokensDetail } from "./lockup";
import {
  MsgExitPoolAction,
  MsgExitPoolDetail,
  MsgExitSwapExternAmountOutAction,
  MsgExitSwapExternAmountOutDetail,
  MsgExitSwapShareAmountInAction,
  MsgExitSwapShareAmountInDetail,
  MsgJoinPoolAction,
  MsgJoinPoolDetail,
  MsgJoinSwapExternAmountInAction,
  MsgJoinSwapExternAmountInDetail,
  MsgJoinSwapShareAmountOutAction,
  MsgJoinSwapShareAmountOutDetail,
} from "./lp";
import {
  MsgLockAndSuperfluidDelegateAction,
  MsgLockAndSuperfluidDelegateDetail,
} from "./superfluid";
import {
  MsgSwapExactAmountInAction,
  MsgSwapExactAmountInDetail,
  MsgSwapExactAmountOutAction,
  MsgSwapExactAmountOutDetail,
} from "./swap";

export const PoolMsgAction = ({
  ampCopierSection,
  assetInfos,
  msg,
  pool,
}: {
  msg: Message;
  pool: PoolData;
  assetInfos: Option<AssetInfos>;
  ampCopierSection?: string;
}) => {
  // TODO: fix this type casting
  const { detail, log, type } = msg as unknown as {
    type: string;
    detail: Record<string, unknown>;
    log: Log;
  };

  switch (type) {
    case "/osmosis.gamm.v1beta1.MsgSwapExactAmountIn":
    case "/osmosis.poolmanager.v1beta1.MsgSwapExactAmountIn": {
      const details = extractTxDetails(type, detail, log);
      return (
        <MsgSwapExactAmountInAction
          ampCopierSection={ampCopierSection}
          assetInfos={assetInfos}
          msg={details}
        />
      );
    }
    case "/osmosis.gamm.v1beta1.MsgSwapExactAmountOut":
    case "/osmosis.poolmanager.v1beta1.MsgSwapExactAmountOut": {
      const details = extractTxDetails(type, detail, log);
      return (
        <MsgSwapExactAmountOutAction
          ampCopierSection={ampCopierSection}
          assetInfos={assetInfos}
          msg={details}
        />
      );
    }
    case "/osmosis.gamm.v1beta1.MsgJoinPool": {
      const details = extractTxDetails(type, detail, log);
      return (
        <MsgJoinPoolAction
          ampCopierSection={ampCopierSection}
          assetInfos={assetInfos}
          msg={details}
          pool={pool}
        />
      );
    }
    case "/osmosis.gamm.v1beta1.MsgJoinSwapExternAmountIn": {
      const details = extractTxDetails(type, detail, log);
      return (
        <MsgJoinSwapExternAmountInAction
          ampCopierSection={ampCopierSection}
          assetInfos={assetInfos}
          msg={details}
          pool={pool}
        />
      );
    }
    case "/osmosis.gamm.v1beta1.MsgJoinSwapShareAmountOut": {
      const details = extractTxDetails(type, detail, log);
      return (
        <MsgJoinSwapShareAmountOutAction
          ampCopierSection={ampCopierSection}
          assetInfos={assetInfos}
          msg={details}
          pool={pool}
        />
      );
    }
    case "/osmosis.gamm.v1beta1.MsgExitPool": {
      const details = extractTxDetails(type, detail, log);
      return (
        <MsgExitPoolAction
          ampCopierSection={ampCopierSection}
          assetInfos={assetInfos}
          msg={details}
          pool={pool}
        />
      );
    }
    case "/osmosis.gamm.v1beta1.MsgExitSwapShareAmountIn": {
      const details = extractTxDetails(type, detail, log);
      return (
        <MsgExitSwapShareAmountInAction
          ampCopierSection={ampCopierSection}
          assetInfos={assetInfos}
          msg={details}
          pool={pool}
        />
      );
    }
    case "/osmosis.gamm.v1beta1.MsgExitSwapExternAmountOut": {
      const details = extractTxDetails(type, detail, log);
      return (
        <MsgExitSwapExternAmountOutAction
          ampCopierSection={ampCopierSection}
          assetInfos={assetInfos}
          msg={details}
          pool={pool}
        />
      );
    }
    case "/osmosis.lockup.MsgLockTokens": {
      const details = extractTxDetails(type, detail, log);
      return (
        <MsgLockTokensAction
          ampCopierSection={ampCopierSection}
          assetInfos={assetInfos}
          msg={details}
          pool={pool}
        />
      );
    }
    case "/osmosis.superfluid.MsgLockAndSuperfluidDelegate": {
      const details = extractTxDetails(type, detail, log);
      return (
        <MsgLockAndSuperfluidDelegateAction
          ampCopierSection={ampCopierSection}
          assetInfos={assetInfos}
          msg={details}
          pool={pool}
        />
      );
    }
    default: {
      return <Text>{msg.type}</Text>;
    }
  }
};

export const PoolMsgDetail = ({
  ampCopierSection,
  assetInfos,
  blockHeight,
  isOpened,
  msg,
  msgIndex,
  pool,
  txHash,
}: {
  txHash: string;
  blockHeight: number;
  msgIndex: number;
  msg: Message;
  pool: PoolData;
  assetInfos: Option<AssetInfos>;
  isOpened: boolean;
  ampCopierSection?: string;
}) => {
  // TODO: fix this type casting
  const { detail, log, type } = msg as unknown as {
    type: string;
    detail: Record<string, unknown>;
    log: Log;
  };

  switch (type) {
    case "/osmosis.gamm.v1beta1.MsgSwapExactAmountIn":
    case "/osmosis.poolmanager.v1beta1.MsgSwapExactAmountIn": {
      const details = extractTxDetails(type, detail, log);
      return (
        <MsgSwapExactAmountInDetail
          ampCopierSection={ampCopierSection}
          assetInfos={assetInfos}
          blockHeight={blockHeight}
          isOpened={isOpened}
          msg={details}
          msgIndex={msgIndex}
          txHash={txHash}
        />
      );
    }
    case "/osmosis.gamm.v1beta1.MsgSwapExactAmountOut":
    case "/osmosis.poolmanager.v1beta1.MsgSwapExactAmountOut": {
      const details = extractTxDetails(type, detail, log);
      return (
        <MsgSwapExactAmountOutDetail
          ampCopierSection={ampCopierSection}
          assetInfos={assetInfos}
          blockHeight={blockHeight}
          isOpened={isOpened}
          msg={details}
          msgIndex={msgIndex}
          txHash={txHash}
        />
      );
    }
    case "/osmosis.gamm.v1beta1.MsgJoinPool": {
      const details = extractTxDetails(type, detail, log);
      return (
        <MsgJoinPoolDetail
          ampCopierSection={ampCopierSection}
          assetInfos={assetInfos}
          blockHeight={blockHeight}
          isOpened={isOpened}
          msg={details}
          msgIndex={msgIndex}
          txHash={txHash}
        />
      );
    }
    case "/osmosis.gamm.v1beta1.MsgJoinSwapExternAmountIn": {
      const details = extractTxDetails(type, detail, log);
      return (
        <MsgJoinSwapExternAmountInDetail
          ampCopierSection={ampCopierSection}
          assetInfos={assetInfos}
          blockHeight={blockHeight}
          isOpened={isOpened}
          msg={details}
          msgIndex={msgIndex}
          txHash={txHash}
        />
      );
    }
    case "/osmosis.gamm.v1beta1.MsgJoinSwapShareAmountOut": {
      const details = extractTxDetails(type, detail, log);
      return (
        <MsgJoinSwapShareAmountOutDetail
          ampCopierSection={ampCopierSection}
          assetInfos={assetInfos}
          blockHeight={blockHeight}
          isOpened={isOpened}
          msg={details}
          msgIndex={msgIndex}
          txHash={txHash}
        />
      );
    }
    case "/osmosis.gamm.v1beta1.MsgExitPool": {
      const details = extractTxDetails(type, detail, log);
      return (
        <MsgExitPoolDetail
          ampCopierSection={ampCopierSection}
          assetInfos={assetInfos}
          blockHeight={blockHeight}
          isOpened={isOpened}
          msg={details}
          msgIndex={msgIndex}
          txHash={txHash}
        />
      );
    }
    case "/osmosis.gamm.v1beta1.MsgExitSwapShareAmountIn": {
      const details = extractTxDetails(type, detail, log);
      return (
        <MsgExitSwapShareAmountInDetail
          ampCopierSection={ampCopierSection}
          assetInfos={assetInfos}
          blockHeight={blockHeight}
          isOpened={isOpened}
          msg={details}
          msgIndex={msgIndex}
          txHash={txHash}
        />
      );
    }
    case "/osmosis.gamm.v1beta1.MsgExitSwapExternAmountOut": {
      const details = extractTxDetails(type, detail, log);
      return (
        <MsgExitSwapExternAmountOutDetail
          ampCopierSection={ampCopierSection}
          assetInfos={assetInfos}
          blockHeight={blockHeight}
          isOpened={isOpened}
          msg={details}
          msgIndex={msgIndex}
          txHash={txHash}
        />
      );
    }
    case "/osmosis.lockup.MsgLockTokens": {
      const details = extractTxDetails(type, detail, log);
      return (
        <MsgLockTokensDetail
          ampCopierSection={ampCopierSection}
          assetInfos={assetInfos}
          blockHeight={blockHeight}
          isOpened={isOpened}
          msg={details}
          msgIndex={msgIndex}
          pool={pool}
          txHash={txHash}
        />
      );
    }
    case "/osmosis.superfluid.MsgLockAndSuperfluidDelegate": {
      const details = extractTxDetails(type, detail, log);
      return (
        <MsgLockAndSuperfluidDelegateDetail
          ampCopierSection={ampCopierSection}
          assetInfos={assetInfos}
          blockHeight={blockHeight}
          isOpened={isOpened}
          msg={details}
          msgIndex={msgIndex}
          pool={pool}
          txHash={txHash}
        />
      );
    }
    default:
      // TODO: revisit if detail is undefined
      return <Text h={20}>{JSON.stringify(msg.detail)}</Text>;
  }
};

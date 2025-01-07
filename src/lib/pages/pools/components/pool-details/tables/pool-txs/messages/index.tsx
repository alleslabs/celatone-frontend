import { Text } from "@chakra-ui/react";
import type { Log } from "@cosmjs/stargate/build/logs";

import type { AssetInfos, Message, Option, PoolData } from "lib/types";
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
  ampCopierSection?: string;
  assetInfos: Option<AssetInfos>;
  msg: Message;
  pool: PoolData;
}) => {
  // TODO: fix this type casting
  const { detail, log, type } = msg as unknown as {
    detail: Record<string, unknown>;
    log: Log;
    type: string;
  };

  switch (type) {
    case "/osmosis.gamm.v1beta1.MsgExitPool": {
      const details = extractTxDetails(type, detail, log);
      return (
        <MsgExitPoolAction
          msg={details}
          ampCopierSection={ampCopierSection}
          assetInfos={assetInfos}
          pool={pool}
        />
      );
    }
    case "/osmosis.gamm.v1beta1.MsgExitSwapExternAmountOut": {
      const details = extractTxDetails(type, detail, log);
      return (
        <MsgExitSwapExternAmountOutAction
          msg={details}
          ampCopierSection={ampCopierSection}
          assetInfos={assetInfos}
          pool={pool}
        />
      );
    }
    case "/osmosis.gamm.v1beta1.MsgExitSwapShareAmountIn": {
      const details = extractTxDetails(type, detail, log);
      return (
        <MsgExitSwapShareAmountInAction
          msg={details}
          ampCopierSection={ampCopierSection}
          assetInfos={assetInfos}
          pool={pool}
        />
      );
    }
    case "/osmosis.gamm.v1beta1.MsgJoinPool": {
      const details = extractTxDetails(type, detail, log);
      return (
        <MsgJoinPoolAction
          msg={details}
          ampCopierSection={ampCopierSection}
          assetInfos={assetInfos}
          pool={pool}
        />
      );
    }
    case "/osmosis.gamm.v1beta1.MsgJoinSwapExternAmountIn": {
      const details = extractTxDetails(type, detail, log);
      return (
        <MsgJoinSwapExternAmountInAction
          msg={details}
          ampCopierSection={ampCopierSection}
          assetInfos={assetInfos}
          pool={pool}
        />
      );
    }
    case "/osmosis.gamm.v1beta1.MsgJoinSwapShareAmountOut": {
      const details = extractTxDetails(type, detail, log);
      return (
        <MsgJoinSwapShareAmountOutAction
          msg={details}
          ampCopierSection={ampCopierSection}
          assetInfos={assetInfos}
          pool={pool}
        />
      );
    }
    case "/osmosis.gamm.v1beta1.MsgSwapExactAmountIn":
    case "/osmosis.poolmanager.v1beta1.MsgSwapExactAmountIn": {
      const details = extractTxDetails(type, detail, log);
      return (
        <MsgSwapExactAmountInAction
          msg={details}
          ampCopierSection={ampCopierSection}
          assetInfos={assetInfos}
        />
      );
    }
    case "/osmosis.gamm.v1beta1.MsgSwapExactAmountOut":
    case "/osmosis.poolmanager.v1beta1.MsgSwapExactAmountOut": {
      const details = extractTxDetails(type, detail, log);
      return (
        <MsgSwapExactAmountOutAction
          msg={details}
          ampCopierSection={ampCopierSection}
          assetInfos={assetInfos}
        />
      );
    }
    case "/osmosis.lockup.MsgLockTokens": {
      const details = extractTxDetails(type, detail, log);
      return (
        <MsgLockTokensAction
          msg={details}
          ampCopierSection={ampCopierSection}
          assetInfos={assetInfos}
          pool={pool}
        />
      );
    }
    case "/osmosis.superfluid.MsgLockAndSuperfluidDelegate": {
      const details = extractTxDetails(type, detail, log);
      return (
        <MsgLockAndSuperfluidDelegateAction
          msg={details}
          ampCopierSection={ampCopierSection}
          assetInfos={assetInfos}
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
  ampCopierSection?: string;
  assetInfos: Option<AssetInfos>;
  blockHeight: number;
  isOpened: boolean;
  msg: Message;
  msgIndex: number;
  pool: PoolData;
  txHash: string;
}) => {
  // TODO: fix this type casting
  const { detail, log, type } = msg as unknown as {
    detail: Record<string, unknown>;
    log: Log;
    type: string;
  };

  switch (type) {
    case "/osmosis.gamm.v1beta1.MsgExitPool": {
      const details = extractTxDetails(type, detail, log);
      return (
        <MsgExitPoolDetail
          isOpened={isOpened}
          msg={details}
          msgIndex={msgIndex}
          txHash={txHash}
          ampCopierSection={ampCopierSection}
          assetInfos={assetInfos}
          blockHeight={blockHeight}
        />
      );
    }
    case "/osmosis.gamm.v1beta1.MsgExitSwapExternAmountOut": {
      const details = extractTxDetails(type, detail, log);
      return (
        <MsgExitSwapExternAmountOutDetail
          isOpened={isOpened}
          msg={details}
          msgIndex={msgIndex}
          txHash={txHash}
          ampCopierSection={ampCopierSection}
          assetInfos={assetInfos}
          blockHeight={blockHeight}
        />
      );
    }
    case "/osmosis.gamm.v1beta1.MsgExitSwapShareAmountIn": {
      const details = extractTxDetails(type, detail, log);
      return (
        <MsgExitSwapShareAmountInDetail
          isOpened={isOpened}
          msg={details}
          msgIndex={msgIndex}
          txHash={txHash}
          ampCopierSection={ampCopierSection}
          assetInfos={assetInfos}
          blockHeight={blockHeight}
        />
      );
    }
    case "/osmosis.gamm.v1beta1.MsgJoinPool": {
      const details = extractTxDetails(type, detail, log);
      return (
        <MsgJoinPoolDetail
          isOpened={isOpened}
          msg={details}
          msgIndex={msgIndex}
          txHash={txHash}
          ampCopierSection={ampCopierSection}
          assetInfos={assetInfos}
          blockHeight={blockHeight}
        />
      );
    }
    case "/osmosis.gamm.v1beta1.MsgJoinSwapExternAmountIn": {
      const details = extractTxDetails(type, detail, log);
      return (
        <MsgJoinSwapExternAmountInDetail
          isOpened={isOpened}
          msg={details}
          msgIndex={msgIndex}
          txHash={txHash}
          ampCopierSection={ampCopierSection}
          assetInfos={assetInfos}
          blockHeight={blockHeight}
        />
      );
    }
    case "/osmosis.gamm.v1beta1.MsgJoinSwapShareAmountOut": {
      const details = extractTxDetails(type, detail, log);
      return (
        <MsgJoinSwapShareAmountOutDetail
          isOpened={isOpened}
          msg={details}
          msgIndex={msgIndex}
          txHash={txHash}
          ampCopierSection={ampCopierSection}
          assetInfos={assetInfos}
          blockHeight={blockHeight}
        />
      );
    }
    case "/osmosis.gamm.v1beta1.MsgSwapExactAmountIn":
    case "/osmosis.poolmanager.v1beta1.MsgSwapExactAmountIn": {
      const details = extractTxDetails(type, detail, log);
      return (
        <MsgSwapExactAmountInDetail
          isOpened={isOpened}
          msg={details}
          msgIndex={msgIndex}
          txHash={txHash}
          ampCopierSection={ampCopierSection}
          assetInfos={assetInfos}
          blockHeight={blockHeight}
        />
      );
    }
    case "/osmosis.gamm.v1beta1.MsgSwapExactAmountOut":
    case "/osmosis.poolmanager.v1beta1.MsgSwapExactAmountOut": {
      const details = extractTxDetails(type, detail, log);
      return (
        <MsgSwapExactAmountOutDetail
          isOpened={isOpened}
          msg={details}
          msgIndex={msgIndex}
          txHash={txHash}
          ampCopierSection={ampCopierSection}
          assetInfos={assetInfos}
          blockHeight={blockHeight}
        />
      );
    }
    case "/osmosis.lockup.MsgLockTokens": {
      const details = extractTxDetails(type, detail, log);
      return (
        <MsgLockTokensDetail
          isOpened={isOpened}
          msg={details}
          msgIndex={msgIndex}
          txHash={txHash}
          ampCopierSection={ampCopierSection}
          assetInfos={assetInfos}
          blockHeight={blockHeight}
          pool={pool}
        />
      );
    }
    case "/osmosis.superfluid.MsgLockAndSuperfluidDelegate": {
      const details = extractTxDetails(type, detail, log);
      return (
        <MsgLockAndSuperfluidDelegateDetail
          isOpened={isOpened}
          msg={details}
          msgIndex={msgIndex}
          txHash={txHash}
          ampCopierSection={ampCopierSection}
          assetInfos={assetInfos}
          blockHeight={blockHeight}
          pool={pool}
        />
      );
    }
    default:
      // TODO: revisit if detail is undefined
      return <Text h={20}>{JSON.stringify(msg.detail)}</Text>;
  }
};

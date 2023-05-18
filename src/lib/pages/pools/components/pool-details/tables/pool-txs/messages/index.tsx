import { Text } from "@chakra-ui/react";
import type Big from "big.js";

import type { AssetInfosOpt } from "lib/services/assetService";
import type { Message, PoolDetail, TokenWithValue } from "lib/types";
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
  msg,
  pool,
  assetInfos,
}: {
  msg: Message;
  pool: PoolDetail<Big, TokenWithValue>;
  assetInfos: AssetInfosOpt;
}) => {
  const { type, detail, log } = msg;
  switch (type) {
    case "/osmosis.gamm.v1beta1.MsgSwapExactAmountIn":
    case "/osmosis.poolmanager.v1beta1.MsgSwapExactAmountIn": {
      const details = extractTxDetails(type, detail, log);
      return (
        <MsgSwapExactAmountInAction msg={details} assetInfos={assetInfos} />
      );
    }
    case "/osmosis.gamm.v1beta1.MsgSwapExactAmountOut":
    case "/osmosis.poolmanager.v1beta1.MsgSwapExactAmountOut": {
      const details = extractTxDetails(type, detail, log);
      return (
        <MsgSwapExactAmountOutAction msg={details} assetInfos={assetInfos} />
      );
    }
    case "/osmosis.gamm.v1beta1.MsgJoinPool": {
      const details = extractTxDetails(type, detail, log);
      return (
        <MsgJoinPoolAction msg={details} pool={pool} assetInfos={assetInfos} />
      );
    }
    case "/osmosis.gamm.v1beta1.MsgJoinSwapExternAmountIn": {
      const details = extractTxDetails(type, detail, log);
      return (
        <MsgJoinSwapExternAmountInAction
          msg={details}
          pool={pool}
          assetInfos={assetInfos}
        />
      );
    }
    case "/osmosis.gamm.v1beta1.MsgJoinSwapShareAmountOut": {
      const details = extractTxDetails(type, detail, log);
      return (
        <MsgJoinSwapShareAmountOutAction
          msg={details}
          pool={pool}
          assetInfos={assetInfos}
        />
      );
    }
    case "/osmosis.gamm.v1beta1.MsgExitPool": {
      const details = extractTxDetails(type, detail, log);
      return (
        <MsgExitPoolAction msg={details} pool={pool} assetInfos={assetInfos} />
      );
    }
    case "/osmosis.gamm.v1beta1.MsgExitSwapShareAmountIn": {
      const details = extractTxDetails(type, detail, log);
      return (
        <MsgExitSwapShareAmountInAction
          msg={details}
          pool={pool}
          assetInfos={assetInfos}
        />
      );
    }
    case "/osmosis.gamm.v1beta1.MsgExitSwapExternAmountOut": {
      const details = extractTxDetails(type, detail, log);
      return (
        <MsgExitSwapExternAmountOutAction
          msg={details}
          pool={pool}
          assetInfos={assetInfos}
        />
      );
    }
    case "/osmosis.lockup.MsgLockTokens": {
      const details = extractTxDetails(type, detail, log);
      return (
        <MsgLockTokensAction
          msg={details}
          pool={pool}
          assetInfos={assetInfos}
        />
      );
    }
    case "/osmosis.superfluid.MsgLockAndSuperfluidDelegate": {
      const details = extractTxDetails(type, detail, log);
      return (
        <MsgLockAndSuperfluidDelegateAction
          msg={details}
          pool={pool}
          assetInfos={assetInfos}
        />
      );
    }
    default: {
      return <Text>{msg.type}</Text>;
    }
  }
};

export const PoolMsgDetail = ({
  txHash,
  blockHeight,
  msgIndex,
  msg,
  pool,
  assetInfos,
  isOpened,
}: {
  txHash: string;
  blockHeight: number;
  msgIndex: number;
  msg: Message;
  pool: PoolDetail<Big, TokenWithValue>;
  assetInfos: AssetInfosOpt;
  isOpened: boolean;
}) => {
  const { type, detail, log } = msg;
  switch (type) {
    case "/osmosis.gamm.v1beta1.MsgSwapExactAmountIn":
    case "/osmosis.poolmanager.v1beta1.MsgSwapExactAmountIn": {
      const details = extractTxDetails(type, detail, log);
      return (
        <MsgSwapExactAmountInDetail
          txHash={txHash}
          blockHeight={blockHeight}
          msgIndex={msgIndex}
          msg={details}
          assetInfos={assetInfos}
          isOpened={isOpened}
        />
      );
    }
    case "/osmosis.gamm.v1beta1.MsgSwapExactAmountOut":
    case "/osmosis.poolmanager.v1beta1.MsgSwapExactAmountOut": {
      const details = extractTxDetails(type, detail, log);
      return (
        <MsgSwapExactAmountOutDetail
          txHash={txHash}
          blockHeight={blockHeight}
          msgIndex={msgIndex}
          msg={details}
          assetInfos={assetInfos}
          isOpened={isOpened}
        />
      );
    }
    case "/osmosis.gamm.v1beta1.MsgJoinPool": {
      const details = extractTxDetails(type, detail, log);
      return (
        <MsgJoinPoolDetail
          txHash={txHash}
          blockHeight={blockHeight}
          msgIndex={msgIndex}
          msg={details}
          assetInfos={assetInfos}
          isOpened={isOpened}
        />
      );
    }
    case "/osmosis.gamm.v1beta1.MsgJoinSwapExternAmountIn": {
      const details = extractTxDetails(type, detail, log);
      return (
        <MsgJoinSwapExternAmountInDetail
          txHash={txHash}
          blockHeight={blockHeight}
          msgIndex={msgIndex}
          msg={details}
          assetInfos={assetInfos}
          isOpened={isOpened}
        />
      );
    }
    case "/osmosis.gamm.v1beta1.MsgJoinSwapShareAmountOut": {
      const details = extractTxDetails(type, detail, log);
      return (
        <MsgJoinSwapShareAmountOutDetail
          txHash={txHash}
          blockHeight={blockHeight}
          msgIndex={msgIndex}
          msg={details}
          assetInfos={assetInfos}
          isOpened={isOpened}
        />
      );
    }
    case "/osmosis.gamm.v1beta1.MsgExitPool": {
      const details = extractTxDetails(type, detail, log);
      return (
        <MsgExitPoolDetail
          txHash={txHash}
          blockHeight={blockHeight}
          msgIndex={msgIndex}
          msg={details}
          assetInfos={assetInfos}
          isOpened={isOpened}
        />
      );
    }
    case "/osmosis.gamm.v1beta1.MsgExitSwapShareAmountIn": {
      const details = extractTxDetails(type, detail, log);
      return (
        <MsgExitSwapShareAmountInDetail
          txHash={txHash}
          blockHeight={blockHeight}
          msgIndex={msgIndex}
          msg={details}
          assetInfos={assetInfos}
          isOpened={isOpened}
        />
      );
    }
    case "/osmosis.gamm.v1beta1.MsgExitSwapExternAmountOut": {
      const details = extractTxDetails(type, detail, log);
      return (
        <MsgExitSwapExternAmountOutDetail
          txHash={txHash}
          blockHeight={blockHeight}
          msgIndex={msgIndex}
          msg={details}
          assetInfos={assetInfos}
          isOpened={isOpened}
        />
      );
    }
    case "/osmosis.lockup.MsgLockTokens": {
      const details = extractTxDetails(type, detail, log);
      return (
        <MsgLockTokensDetail
          txHash={txHash}
          blockHeight={blockHeight}
          msgIndex={msgIndex}
          msg={details}
          pool={pool}
          assetInfos={assetInfos}
          isOpened={isOpened}
        />
      );
    }
    case "/osmosis.superfluid.MsgLockAndSuperfluidDelegate": {
      const details = extractTxDetails(type, detail, log);
      return (
        <MsgLockAndSuperfluidDelegateDetail
          txHash={txHash}
          blockHeight={blockHeight}
          msgIndex={msgIndex}
          msg={details}
          pool={pool}
          assetInfos={assetInfos}
          isOpened={isOpened}
        />
      );
    }
    default:
      return <Text h={20}>{JSON.stringify(msg.detail)}</Text>;
  }
};

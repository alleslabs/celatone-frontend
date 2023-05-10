import { Text } from "@chakra-ui/react";

import type { AssetInfosOpt } from "lib/services/assetService";
import type { Message } from "lib/types";

import type { MsgSwapExactAmountIn, MsgSwapExactAmountOut } from "./messages";
import {
  MsgSwapExactAmountInAction,
  MsgSwapExactAmountInDetail,
  MsgSwapExactAmountOutAction,
  MsgSwapExactAmountOutDetail,
} from "./swap";

export const PoolMsgAction = ({
  msg,
  assetInfos,
}: {
  msg: Message;
  assetInfos: AssetInfosOpt;
}) => {
  // TODO: fix and add cases
  switch (msg.type) {
    case "/osmosis.gamm.v1beta1.MsgSwapExactAmountIn":
    case "/osmosis.poolmanager.v1beta1.MsgSwapExactAmountIn":
      return (
        <MsgSwapExactAmountInAction
          msg={msg.detail as MsgSwapExactAmountIn}
          assetInfos={assetInfos}
        />
      );
    case "/osmosis.gamm.v1beta1.MsgSwapExactAmountOut":
    case "/osmosis.poolmanager.v1beta1.MsgSwapExactAmountOut":
      return (
        <MsgSwapExactAmountOutAction
          msg={msg.detail as MsgSwapExactAmountOut}
          assetInfos={assetInfos}
        />
      );
    default:
      return <Text>{msg.type}</Text>;
  }
};

export const PoolMsgDetail = ({
  txHash,
  blockHeight,
  msgIndex,
  msg,
  assetInfos,
  isOpened,
}: {
  txHash: string;
  blockHeight: number;
  msgIndex: number;
  msg: Message;
  assetInfos: AssetInfosOpt;
  isOpened: boolean;
}) => {
  // TODO: fix and add cases
  switch (msg.type) {
    case "/osmosis.gamm.v1beta1.MsgSwapExactAmountIn":
    case "/osmosis.poolmanager.v1beta1.MsgSwapExactAmountIn":
      return (
        <MsgSwapExactAmountInDetail
          txHash={txHash}
          blockHeight={blockHeight}
          msgIndex={msgIndex}
          msg={msg.detail as MsgSwapExactAmountIn}
          assetInfos={assetInfos}
          isOpened={isOpened}
        />
      );
    case "/osmosis.gamm.v1beta1.MsgSwapExactAmountOut":
    case "/osmosis.poolmanager.v1beta1.MsgSwapExactAmountOut":
      return (
        <MsgSwapExactAmountOutDetail
          txHash={txHash}
          blockHeight={blockHeight}
          msgIndex={msgIndex}
          msg={msg.detail as MsgSwapExactAmountOut}
          assetInfos={assetInfos}
          isOpened={isOpened}
        />
      );
    default:
      return <Text h={20}>{msg.type}</Text>;
  }
};

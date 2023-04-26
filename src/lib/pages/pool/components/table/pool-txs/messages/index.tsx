import { Text } from "@chakra-ui/react";

import type { AssetInfosOpt } from "lib/services/assetService";
import type { Message } from "lib/types";

import type { MsgSwapExactAmountIn, MsgSwapExactAmountOut } from "./messages";
import { MsgSwapExactAmountInAction } from "./swap/MsgSwapExactAmountInAction";
import { MsgSwapExactAmountInDetail } from "./swap/MsgSwapExactAmountInDetail";
import { MsgSwapExactAmountOutAction } from "./swap/MsgSwapExactAmountOutAction";
import { MsgSwapExactAmountOutDetail } from "./swap/MsgSwapExactAmountOutDetail";

export const PoolTxsAction = ({
  msg,
  assetInfos,
}: {
  msg: Message;
  assetInfos: AssetInfosOpt;
}) => {
  // TODO: fix and add cases
  const { type } = msg;
  switch (type) {
    case "/osmosis.gamm.v1beta1.MsgSwapExactAmountIn":
      return (
        <MsgSwapExactAmountInAction
          msg={msg.detail as MsgSwapExactAmountIn}
          assetInfos={assetInfos}
        />
      );
    case "/osmosis.gamm.v1beta1.MsgSwapExactAmountOut":
      return (
        <MsgSwapExactAmountOutAction
          msg={msg.detail as MsgSwapExactAmountOut}
          assetInfos={assetInfos}
        />
      );
    case "type3":
    default:
      return <Text>{type}</Text>;
  }
};

export const PoolTxsDetail = ({
  txHash,
  blockHeight,
  msgIndex,
  msg,
  assetInfos,
}: {
  txHash: string;
  blockHeight: number;
  msgIndex: number;
  msg: Message;
  assetInfos: AssetInfosOpt;
}) => {
  // TODO: fix and add cases
  const { type } = msg;
  switch (type) {
    case "/osmosis.gamm.v1beta1.MsgSwapExactAmountIn":
      return (
        <MsgSwapExactAmountInDetail
          txHash={txHash}
          blockHeight={blockHeight}
          msgIndex={msgIndex}
          msg={msg.detail as MsgSwapExactAmountIn}
          assetInfos={assetInfos}
        />
      );
    case "/osmosis.gamm.v1beta1.MsgSwapExactAmountOut":
      return (
        <MsgSwapExactAmountOutDetail
          txHash={txHash}
          blockHeight={blockHeight}
          msgIndex={msgIndex}
          msg={msg.detail as MsgSwapExactAmountOut}
          assetInfos={assetInfos}
        />
      );
    case "type3":
    default:
      return <Text h={20}>{type}</Text>;
  }
};

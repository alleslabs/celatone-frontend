import { Flex } from "@chakra-ui/react";

import { MsgToken } from "lib/components/action-msg/MsgToken";
import { CustomIcon } from "lib/components/icon";
import type { AssetInfosOpt } from "lib/services/assetService";
import type { MsgSwapExactAmountInDetails } from "lib/utils/tx/types";

interface MsgSwapExactAmountInActionProps {
  msg: MsgSwapExactAmountInDetails;
  assetInfos: AssetInfosOpt;
}

export const MsgSwapExactAmountInAction = ({
  msg,
  assetInfos,
}: MsgSwapExactAmountInActionProps) => {
  const inAssetInfo = assetInfos?.[msg.token_in.denom];
  const tokenOutDenom = msg.routes.at(-1)?.tokenOutDenom ?? "";
  const outAssetInfo = assetInfos?.[tokenOutDenom];
  return (
    <Flex gap={1} alignItems="center" flexWrap="wrap">
      Swap
      <MsgToken
        coin={msg.token_in}
        symbol={inAssetInfo?.symbol}
        precision={inAssetInfo?.precision}
        fontWeight={700}
      />
      <CustomIcon name="arrow-right" boxSize={4} color="honeydew.main" />
      at least
      <MsgToken
        coin={{ amount: msg.token_out_min_amount, denom: tokenOutDenom }}
        symbol={outAssetInfo?.symbol}
        precision={outAssetInfo?.precision}
        fontWeight={400}
      />
    </Flex>
  );
};

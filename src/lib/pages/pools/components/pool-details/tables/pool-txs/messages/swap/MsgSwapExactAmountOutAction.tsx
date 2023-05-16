import { Flex } from "@chakra-ui/react";

import { MsgToken } from "lib/components/action-msg/MsgToken";
import { CustomIcon } from "lib/components/icon";
import type { AssetInfosOpt } from "lib/services/assetService";
import type { MsgSwapExactAmountOutDetails } from "lib/utils/tx/types";

interface MsgSwapExactAmountOutActionProps {
  msg: MsgSwapExactAmountOutDetails;
  assetInfos: AssetInfosOpt;
}

export const MsgSwapExactAmountOutAction = ({
  msg,
  assetInfos,
}: MsgSwapExactAmountOutActionProps) => {
  const tokenInDenom = msg.routes.at(0)?.tokenInDenom ?? "";
  const inAssetInfo = assetInfos?.[tokenInDenom];
  const outAssetInfo = assetInfos?.[msg.token_out.denom];
  return (
    <Flex gap={1} alignItems="center" flexWrap="wrap">
      Swap at most
      <MsgToken
        coin={{ amount: msg.token_in_max_amount, denom: tokenInDenom }}
        symbol={inAssetInfo?.symbol}
        precision={inAssetInfo?.precision}
        fontWeight={400}
      />
      <CustomIcon name="arrow-right" boxSize={4} color="honeydew.main" />
      <MsgToken
        coin={msg.token_out}
        symbol={outAssetInfo?.symbol}
        precision={outAssetInfo?.precision}
        fontWeight={700}
      />
    </Flex>
  );
};

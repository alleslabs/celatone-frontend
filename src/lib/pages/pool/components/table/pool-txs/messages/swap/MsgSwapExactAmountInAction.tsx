import { Flex } from "@chakra-ui/react";

import type { MsgSwapExactAmountIn } from "../messages";
import { MsgToken } from "lib/components/action-msg/MsgToken";
import { Loading } from "lib/components/Loading";
import { useAssetInfos } from "lib/services/assetService";

interface MsgSwapExactAmountInActionProps {
  msg: MsgSwapExactAmountIn;
}

export const MsgSwapExactAmountInAction = ({
  msg,
}: MsgSwapExactAmountInActionProps) => {
  const { assetInfos, isLoading } = useAssetInfos();
  if (isLoading) return <Loading />;
  const assetInfo = assetInfos?.[msg.tokenIn.denom];
  return (
    <Flex gap={1}>
      Swap
      <MsgToken
        coin={msg.tokenIn}
        symbol={assetInfo?.symbol}
        precision={assetInfo?.precision}
      />
    </Flex>
  );
};

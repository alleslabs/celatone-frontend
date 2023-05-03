import { Flex, Text, Tooltip } from "@chakra-ui/react";

import type { MsgSwapExactAmountIn } from "../messages";
import { MsgToken } from "lib/components/action-msg/MsgToken";
import { Copier } from "lib/components/copy";
import { CustomIcon } from "lib/components/icon";
import type { AssetInfosOpt } from "lib/services/assetService";
import { getTokenLabel } from "lib/utils";

interface MsgSwapExactAmountInActionProps {
  msg: MsgSwapExactAmountIn;
  assetInfos: AssetInfosOpt;
}

export const MsgSwapExactAmountInAction = ({
  msg,
  assetInfos,
}: MsgSwapExactAmountInActionProps) => {
  const inAssetInfo = assetInfos?.[msg.tokenIn.denom];
  const tokenOutDenom = msg.routes.at(-1)?.tokenOutDenom ?? "";
  const outAssetInfo = assetInfos?.[tokenOutDenom];
  return (
    <Flex gap={1} alignItems="center" flexWrap="wrap">
      Swap
      <MsgToken
        coin={msg.tokenIn}
        symbol={inAssetInfo?.symbol}
        precision={inAssetInfo?.precision}
      />
      <CustomIcon name="arrow-right" boxSize={4} color="honeydew.main" />
      <Flex role="group" align="center" gap={1}>
        <Text fontWeight="medium">
          {getTokenLabel(outAssetInfo?.symbol ?? tokenOutDenom)}
        </Text>
        <Tooltip
          hasArrow
          label={`Token ID: ${tokenOutDenom}`}
          placement="top"
          bg="honeydew.darker"
          maxW="240px"
        >
          <Flex cursor="pointer">
            <CustomIcon name="info-circle" boxSize="3" />
          </Flex>
        </Tooltip>
        <Copier
          type={outAssetInfo?.symbol ? "supported_asset" : "unsupported_asset"}
          value={tokenOutDenom}
          copyLabel="Token ID Copied!"
          display="none"
          ml="4px"
        />
      </Flex>
    </Flex>
  );
};

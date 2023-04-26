import { Flex, Text, Tooltip } from "@chakra-ui/react";

import type { MsgSwapExactAmountOut } from "../messages";
import { MsgToken } from "lib/components/action-msg/MsgToken";
import { Copier } from "lib/components/copy";
import { CustomIcon } from "lib/components/icon";
import type { AssetInfosOpt } from "lib/services/assetService";
import { getTokenLabel } from "lib/utils";

interface MsgSwapExactAmountOutActionProps {
  msg: MsgSwapExactAmountOut;
  assetInfos: AssetInfosOpt;
}

export const MsgSwapExactAmountOutAction = ({
  msg,
  assetInfos,
}: MsgSwapExactAmountOutActionProps) => {
  const tokenInDenom = msg.routes.at(0)?.tokenInDenom ?? "";
  const inAssetInfo = assetInfos?.[tokenInDenom];
  const outAssetInfo = assetInfos?.[msg.tokenOut.denom];
  return (
    <Flex gap={1} alignItems="center">
      Swap
      <Flex role="group" align="center" gap={1}>
        <Text fontWeight="medium">
          {getTokenLabel(inAssetInfo?.symbol || tokenInDenom)}
        </Text>
        <Tooltip
          hasArrow
          label={`Token ID: ${tokenInDenom}`}
          placement="top"
          bg="honeydew.darker"
          maxW="240px"
        >
          <Flex cursor="pointer">
            <CustomIcon name="info-circle" boxSize="3" />
          </Flex>
        </Tooltip>
        <Copier
          type={inAssetInfo?.symbol ? "supported_asset" : "unsupported_asset"}
          value={tokenInDenom}
          copyLabel="Token ID Copied!"
          display="none"
          ml="4px"
        />
      </Flex>
      <CustomIcon name="arrow-right" boxSize={4} color="honeydew.main" />
      <MsgToken
        coin={msg.tokenOut}
        symbol={outAssetInfo?.symbol}
        precision={outAssetInfo?.precision}
      />
    </Flex>
  );
};

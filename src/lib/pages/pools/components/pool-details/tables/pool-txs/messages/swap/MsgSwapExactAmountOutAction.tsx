import { Flex } from "@chakra-ui/react";

import { MsgToken } from "lib/components/action-msg/MsgToken";
import { CustomIcon } from "lib/components/icon";
import type { AssetInfos, Option } from "lib/types";
import { coinToTokenWithValue } from "lib/utils";
import type { MsgSwapExactAmountOutDetails } from "lib/utils/tx/types";

interface MsgSwapExactAmountOutActionProps {
  msg: MsgSwapExactAmountOutDetails;
  assetInfos: Option<AssetInfos>;
  ampCopierSection?: string;
}

export const MsgSwapExactAmountOutAction = ({
  msg,
  assetInfos,
  ampCopierSection,
}: MsgSwapExactAmountOutActionProps) => {
  const tokenInDenom = msg.routes[0]?.tokenInDenom ?? "";
  const inToken = coinToTokenWithValue(
    tokenInDenom,
    msg.token_in_max_amount,
    assetInfos
  );
  const outToken = coinToTokenWithValue(
    msg.token_out.denom,
    msg.token_out.amount,
    assetInfos
  );
  return (
    <Flex gap={1} alignItems="center" flexWrap="wrap">
      Swap at most
      <MsgToken
        token={inToken}
        fontWeight={400}
        ampCopierSection={ampCopierSection}
      />
      <CustomIcon name="arrow-right" boxSize={4} color="primary.main" />
      <MsgToken
        token={outToken}
        fontWeight={700}
        ampCopierSection={ampCopierSection}
      />
    </Flex>
  );
};

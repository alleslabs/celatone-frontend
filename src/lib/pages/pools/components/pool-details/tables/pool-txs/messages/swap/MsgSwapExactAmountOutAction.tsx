import type { AssetInfos, Option } from "lib/types";
import type { MsgSwapExactAmountOutDetails } from "lib/utils/tx/types";

import { Flex } from "@chakra-ui/react";
import { MsgToken } from "lib/components/action-msg/MsgToken";
import { CustomIcon } from "lib/components/icon";
import { coinToTokenWithValue } from "lib/utils";

interface MsgSwapExactAmountOutActionProps {
  ampCopierSection?: string;
  assetInfos: Option<AssetInfos>;
  msg: MsgSwapExactAmountOutDetails;
}

export const MsgSwapExactAmountOutAction = ({
  ampCopierSection,
  assetInfos,
  msg,
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
    <Flex alignItems="center" flexWrap="wrap" gap={1}>
      Swap at most
      <MsgToken
        ampCopierSection={ampCopierSection}
        fontWeight={400}
        token={inToken}
      />
      <CustomIcon boxSize={4} color="primary.main" name="arrow-right" />
      <MsgToken
        ampCopierSection={ampCopierSection}
        fontWeight={700}
        token={outToken}
      />
    </Flex>
  );
};

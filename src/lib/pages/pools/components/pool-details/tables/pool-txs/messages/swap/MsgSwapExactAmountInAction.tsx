import { Flex } from "@chakra-ui/react";

import { MsgToken } from "lib/components/action-msg/MsgToken";
import { CustomIcon } from "lib/components/icon";
import type { AssetInfos, Option } from "lib/types";
import { coinToTokenWithValue } from "lib/utils";
import type { MsgSwapExactAmountInDetails } from "lib/utils/tx/types";

interface MsgSwapExactAmountInActionProps {
  ampCopierSection?: string;
  assetInfos: Option<AssetInfos>;
  msg: MsgSwapExactAmountInDetails;
}

export const MsgSwapExactAmountInAction = ({
  ampCopierSection,
  assetInfos,
  msg,
}: MsgSwapExactAmountInActionProps) => {
  const tokenOutDenom = msg.routes[msg.routes.length - 1]?.tokenOutDenom ?? "";
  const inToken = coinToTokenWithValue(
    msg.token_in.denom,
    msg.token_in.amount,
    assetInfos
  );
  const outToken = coinToTokenWithValue(
    tokenOutDenom,
    msg.token_out_min_amount,
    assetInfos
  );
  return (
    <Flex alignItems="center" flexWrap="wrap" gap={1}>
      Swap
      <MsgToken
        ampCopierSection={ampCopierSection}
        fontWeight={700}
        token={inToken}
      />
      <CustomIcon name="arrow-right" boxSize={4} color="primary.main" />
      at least
      <MsgToken
        ampCopierSection={ampCopierSection}
        fontWeight={400}
        token={outToken}
      />
    </Flex>
  );
};

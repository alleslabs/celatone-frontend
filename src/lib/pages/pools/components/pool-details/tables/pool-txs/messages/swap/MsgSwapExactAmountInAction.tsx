import { Flex } from "@chakra-ui/react";

import { MsgToken } from "lib/components/action-msg/MsgToken";
import { CustomIcon } from "lib/components/icon";
import type { AssetInfos, Option } from "lib/types";
import { coinToTokenWithValue } from "lib/utils";
import type { MsgSwapExactAmountInDetails } from "lib/utils/tx/types";

interface MsgSwapExactAmountInActionProps {
  msg: MsgSwapExactAmountInDetails;
  assetInfos: Option<AssetInfos>;
  ampCopierSection?: string;
}

export const MsgSwapExactAmountInAction = ({
  msg,
  assetInfos,
  ampCopierSection,
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
    <Flex gap={1} alignItems="center" flexWrap="wrap">
      Swap
      <MsgToken
        token={inToken}
        fontWeight={700}
        ampCopierSection={ampCopierSection}
      />
      <CustomIcon name="arrow-right" boxSize={4} color="primary.main" />
      at least
      <MsgToken
        token={outToken}
        fontWeight={400}
        ampCopierSection={ampCopierSection}
      />
    </Flex>
  );
};

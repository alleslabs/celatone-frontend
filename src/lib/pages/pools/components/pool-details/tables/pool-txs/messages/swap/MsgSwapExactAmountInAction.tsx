import type { AssetInfos, Option } from "lib/types";
import type { MsgSwapExactAmountInDetails } from "lib/utils/tx/types";

import { Flex } from "@chakra-ui/react";
import { MsgToken } from "lib/components/action-msg/MsgToken";
import { CustomIcon } from "lib/components/icon";
import { coinToTokenWithValue } from "lib/utils";

interface MsgSwapExactAmountInActionProps {
  msg: MsgSwapExactAmountInDetails;
  assetInfos: Option<AssetInfos>;
  ampCopierSection?: string;
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
      <CustomIcon boxSize={4} color="primary.main" name="arrow-right" />
      at least
      <MsgToken
        ampCopierSection={ampCopierSection}
        fontWeight={400}
        token={outToken}
      />
    </Flex>
  );
};

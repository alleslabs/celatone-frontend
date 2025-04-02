import type { AssetInfos, Option, PoolData } from "lib/types";
import type { MsgExitSwapExternAmountOutDetails } from "lib/utils/tx/types";

import { Flex } from "@chakra-ui/react";
import { MsgToken } from "lib/components/action-msg/MsgToken";
import { CustomIcon } from "lib/components/icon";
import { coinToTokenWithValue } from "lib/utils";

import { PoolLogoLink } from "../components";
import { getPoolDenom } from "../utils";

interface MsgExitSwapExternAmountOutActionProps {
  msg: MsgExitSwapExternAmountOutDetails;
  pool: PoolData;
  assetInfos: Option<AssetInfos>;
  ampCopierSection?: string;
}

export const MsgExitSwapExternAmountOutAction = ({
  msg,
  pool,
  assetInfos,
  ampCopierSection,
}: MsgExitSwapExternAmountOutActionProps) => {
  const poolDenom = getPoolDenom(msg.pool_id);
  const poolToken = coinToTokenWithValue(
    poolDenom,
    msg.share_in_max_amount,
    assetInfos
  );
  const outToken = coinToTokenWithValue(
    msg.token_out.denom,
    msg.token_out.amount,
    assetInfos
  );
  return (
    <Flex alignItems="center" flexWrap="wrap" gap={1}>
      Burned at most
      <MsgToken
        ampCopierSection={ampCopierSection}
        fontWeight={400}
        token={poolToken}
      />
      to
      <PoolLogoLink ampCopierSection={ampCopierSection} pool={pool} />
      <CustomIcon boxSize={4} color="primary.main" name="arrow-right" />
      <MsgToken
        ampCopierSection={ampCopierSection}
        fontWeight={700}
        token={outToken}
      />
    </Flex>
  );
};

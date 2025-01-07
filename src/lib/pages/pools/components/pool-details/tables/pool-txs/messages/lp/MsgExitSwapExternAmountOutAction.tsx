import { Flex } from "@chakra-ui/react";

import { PoolLogoLink } from "../components";
import { getPoolDenom } from "../utils";
import { MsgToken } from "lib/components/action-msg/MsgToken";
import { CustomIcon } from "lib/components/icon";
import type { AssetInfos, Option, PoolData } from "lib/types";
import { coinToTokenWithValue } from "lib/utils";
import type { MsgExitSwapExternAmountOutDetails } from "lib/utils/tx/types";

interface MsgExitSwapExternAmountOutActionProps {
  ampCopierSection?: string;
  assetInfos: Option<AssetInfos>;
  msg: MsgExitSwapExternAmountOutDetails;
  pool: PoolData;
}

export const MsgExitSwapExternAmountOutAction = ({
  ampCopierSection,
  assetInfos,
  msg,
  pool,
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
      <CustomIcon name="arrow-right" boxSize={4} color="primary.main" />
      <MsgToken
        ampCopierSection={ampCopierSection}
        fontWeight={700}
        token={outToken}
      />
    </Flex>
  );
};

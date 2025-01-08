import { Flex } from "@chakra-ui/react";

import { PoolLogoLink } from "../components";
import { getPoolDenom } from "../utils";
import { MsgToken } from "lib/components/action-msg/MsgToken";
import { CustomIcon } from "lib/components/icon";
import type { AssetInfos, Option, PoolData } from "lib/types";
import { coinToTokenWithValue } from "lib/utils";
import type { MsgExitSwapExternAmountOutDetails } from "lib/utils/tx/types";

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
    <Flex gap={1} alignItems="center" flexWrap="wrap">
      Burned at most
      <MsgToken
        token={poolToken}
        fontWeight={400}
        ampCopierSection={ampCopierSection}
      />
      to
      <PoolLogoLink pool={pool} ampCopierSection={ampCopierSection} />
      <CustomIcon name="arrow-right" boxSize={4} color="primary.main" />
      <MsgToken
        token={outToken}
        fontWeight={700}
        ampCopierSection={ampCopierSection}
      />
    </Flex>
  );
};

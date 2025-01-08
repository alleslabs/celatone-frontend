import { Flex } from "@chakra-ui/react";

import { PoolLogoLink } from "../components";
import { getPoolDenom } from "../utils";
import { MsgToken } from "lib/components/action-msg/MsgToken";
import { CustomIcon } from "lib/components/icon";
import type { AssetInfos, Option, PoolData } from "lib/types";
import { coinToTokenWithValue } from "lib/utils";
import type { MsgJoinSwapShareAmountOutDetails } from "lib/utils/tx/types";

interface MsgJoinSwapShareAmountOutActionProps {
  ampCopierSection?: string;
  assetInfos: Option<AssetInfos>;
  msg: MsgJoinSwapShareAmountOutDetails;
  pool: PoolData;
}

export const MsgJoinSwapShareAmountOutAction = ({
  ampCopierSection,
  assetInfos,
  msg,
  pool,
}: MsgJoinSwapShareAmountOutActionProps) => {
  const poolDenom = getPoolDenom(msg.pool_id);
  const inToken = coinToTokenWithValue(
    msg.token_in_denom,
    msg.token_in_max_amount,
    assetInfos
  );
  const poolToken = coinToTokenWithValue(
    poolDenom,
    msg.share_out_amount,
    assetInfos
  );
  return (
    <Flex alignItems="center" flexWrap="wrap" gap={1}>
      Provided at most
      <MsgToken
        ampCopierSection={ampCopierSection}
        fontWeight={400}
        token={inToken}
      />
      to
      <PoolLogoLink ampCopierSection={ampCopierSection} pool={pool} />
      <CustomIcon name="arrow-right" boxSize={4} color="primary.main" />
      <MsgToken
        ampCopierSection={ampCopierSection}
        fontWeight={700}
        token={poolToken}
      />
    </Flex>
  );
};

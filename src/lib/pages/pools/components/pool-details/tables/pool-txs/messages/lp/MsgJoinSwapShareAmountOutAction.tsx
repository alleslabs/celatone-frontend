import { Flex } from "@chakra-ui/react";

import { PoolLogoLink } from "../components";
import { getPoolDenom } from "../utils";
import { MsgToken } from "lib/components/action-msg/MsgToken";
import { CustomIcon } from "lib/components/icon";
import type { AssetInfos, Option, PoolData } from "lib/types";
import { coinToTokenWithValue } from "lib/utils";
import type { MsgJoinSwapShareAmountOutDetails } from "lib/utils/tx/types";

interface MsgJoinSwapShareAmountOutActionProps {
  msg: MsgJoinSwapShareAmountOutDetails;
  pool: PoolData;
  assetInfos: Option<AssetInfos>;
  ampCopierSection?: string;
}

export const MsgJoinSwapShareAmountOutAction = ({
  msg,
  pool,
  assetInfos,
  ampCopierSection,
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
    <Flex gap={1} alignItems="center" flexWrap="wrap">
      Provided at most
      <MsgToken
        token={inToken}
        fontWeight={400}
        ampCopierSection={ampCopierSection}
      />
      to
      <PoolLogoLink pool={pool} ampCopierSection={ampCopierSection} />
      <CustomIcon name="arrow-right" boxSize={4} color="primary.main" />
      <MsgToken
        token={poolToken}
        fontWeight={700}
        ampCopierSection={ampCopierSection}
      />
    </Flex>
  );
};

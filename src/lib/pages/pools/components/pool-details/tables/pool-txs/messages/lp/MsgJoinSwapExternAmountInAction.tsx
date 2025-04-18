import type { AssetInfos, Option, PoolData } from "lib/types";
import type { MsgJoinSwapExternAmountInDetails } from "lib/utils/tx/types";

import { Flex } from "@chakra-ui/react";
import { MsgToken } from "lib/components/action-msg/MsgToken";
import { CustomIcon } from "lib/components/icon";
import { coinToTokenWithValue } from "lib/utils";

import { PoolLogoLink } from "../components";
import { getPoolDenom } from "../utils";

interface MsgJoinSwapExternAmountInActionProps {
  msg: MsgJoinSwapExternAmountInDetails;
  pool: PoolData;
  assetInfos: Option<AssetInfos>;
  ampCopierSection?: string;
}

export const MsgJoinSwapExternAmountInAction = ({
  ampCopierSection,
  assetInfos,
  msg,
  pool,
}: MsgJoinSwapExternAmountInActionProps) => {
  const poolDenom = getPoolDenom(msg.pool_id);
  const inToken = coinToTokenWithValue(
    msg.token_in.denom,
    msg.token_in.amount,
    assetInfos
  );
  const poolToken = coinToTokenWithValue(
    poolDenom,
    msg.share_out_min_amount,
    assetInfos
  );
  return (
    <Flex alignItems="center" flexWrap="wrap" gap={1}>
      Provided
      <MsgToken
        ampCopierSection={ampCopierSection}
        fontWeight={700}
        token={inToken}
      />
      to
      <PoolLogoLink ampCopierSection={ampCopierSection} pool={pool} />
      <CustomIcon boxSize={4} color="primary.main" name="arrow-right" />
      at least
      <MsgToken
        ampCopierSection={ampCopierSection}
        fontWeight={400}
        token={poolToken}
      />
    </Flex>
  );
};

import { Flex } from "@chakra-ui/react";

import { PoolLogoLink } from "../components";
import { getPoolDenom } from "../utils";
import { MsgToken } from "lib/components/action-msg/MsgToken";
import { CustomIcon } from "lib/components/icon";
import type { AssetInfos, Option, PoolDetail } from "lib/types";
import { coinToTokenWithValue } from "lib/utils";
import type { MsgJoinSwapExternAmountInDetails } from "lib/utils/tx/types";

interface MsgJoinSwapExternAmountInActionProps {
  msg: MsgJoinSwapExternAmountInDetails;
  pool: PoolDetail;
  assetInfos: Option<AssetInfos>;
  ampCopierSection?: string;
}

export const MsgJoinSwapExternAmountInAction = ({
  msg,
  pool,
  assetInfos,
  ampCopierSection,
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
    <Flex gap={1} alignItems="center" flexWrap="wrap">
      Provided
      <MsgToken
        token={inToken}
        fontWeight={700}
        ampCopierSection={ampCopierSection}
      />
      to
      <PoolLogoLink pool={pool} ampCopierSection={ampCopierSection} />
      <CustomIcon name="arrow-right" boxSize={4} color="primary.main" />
      at least
      <MsgToken
        token={poolToken}
        fontWeight={400}
        ampCopierSection={ampCopierSection}
      />
    </Flex>
  );
};

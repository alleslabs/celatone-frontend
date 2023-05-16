import { Flex } from "@chakra-ui/react";
import type Big from "big.js";

import { PoolLogoLink } from "../components";
import { getPoolDenom } from "../utils";
import { MsgToken } from "lib/components/action-msg/MsgToken";
import { CustomIcon } from "lib/components/icon";
import type { AssetInfosOpt } from "lib/services/assetService";
import type { PoolDetail, TokenWithValue } from "lib/types";
import type { MsgJoinSwapExternAmountInDetails } from "lib/utils/tx/types";

interface MsgJoinSwapExternAmountInActionProps {
  msg: MsgJoinSwapExternAmountInDetails;
  pool: PoolDetail<Big, TokenWithValue>;
  assetInfos: AssetInfosOpt;
}

export const MsgJoinSwapExternAmountInAction = ({
  msg,
  pool,
  assetInfos,
}: MsgJoinSwapExternAmountInActionProps) => {
  const inAssetInfo = assetInfos?.[msg.token_in.denom];
  const poolDenom = getPoolDenom(msg.pool_id);
  const poolAssetInfo = assetInfos?.[poolDenom];
  return (
    <Flex gap={1} alignItems="center" flexWrap="wrap">
      Provided
      <MsgToken
        coin={msg.token_in}
        symbol={inAssetInfo?.symbol}
        precision={inAssetInfo?.precision}
        fontWeight={700}
      />
      to
      <PoolLogoLink pool={pool} />
      <CustomIcon name="arrow-right" boxSize={4} color="honeydew.main" />
      at least
      <MsgToken
        coin={{ amount: msg.share_out_min_amount, denom: poolDenom }}
        symbol={poolAssetInfo?.symbol}
        precision={poolAssetInfo?.precision}
        fontWeight={400}
      />
    </Flex>
  );
};

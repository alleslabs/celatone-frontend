import { Flex } from "@chakra-ui/react";

import { PoolLogoLink } from "../components";
import { getPoolDenom } from "../utils";
import { MsgToken } from "lib/components/action-msg/MsgToken";
import { CustomIcon } from "lib/components/icon";
import type { AssetInfosOpt } from "lib/services/assetService";
import type { PoolDetail } from "lib/types";
import type { MsgJoinSwapExternAmountInDetails } from "lib/utils/tx/types";

interface MsgJoinSwapExternAmountInActionProps {
  msg: MsgJoinSwapExternAmountInDetails;
  pool: PoolDetail;
  assetInfos: AssetInfosOpt;
  ampCopierSection?: string;
}

export const MsgJoinSwapExternAmountInAction = ({
  msg,
  pool,
  assetInfos,
  ampCopierSection,
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
        ampCopierSection={ampCopierSection}
      />
      to
      <PoolLogoLink pool={pool} ampCopierSection={ampCopierSection} />
      <CustomIcon name="arrow-right" boxSize={4} color="honeydew.main" />
      at least
      <MsgToken
        coin={{ amount: msg.share_out_min_amount, denom: poolDenom }}
        symbol={poolAssetInfo?.symbol}
        precision={poolAssetInfo?.precision}
        fontWeight={400}
        ampCopierSection={ampCopierSection}
      />
    </Flex>
  );
};

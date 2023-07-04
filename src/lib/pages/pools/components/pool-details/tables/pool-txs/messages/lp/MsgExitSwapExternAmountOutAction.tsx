import { Flex } from "@chakra-ui/react";

import { PoolLogoLink } from "../components";
import { getPoolDenom } from "../utils";
import { MsgToken } from "lib/components/action-msg/MsgToken";
import { CustomIcon } from "lib/components/icon";
import type { AssetInfosOpt } from "lib/services/assetService";
import type { PoolDetail } from "lib/types";
import type { MsgExitSwapExternAmountOutDetails } from "lib/utils/tx/types";

interface MsgExitSwapExternAmountOutActionProps {
  msg: MsgExitSwapExternAmountOutDetails;
  pool: PoolDetail;
  assetInfos: AssetInfosOpt;
  ampCopierSection?: string;
}

export const MsgExitSwapExternAmountOutAction = ({
  msg,
  pool,
  assetInfos,
  ampCopierSection,
}: MsgExitSwapExternAmountOutActionProps) => {
  const outAssetInfo = assetInfos?.[msg.token_out.denom];
  const poolDenom = getPoolDenom(msg.pool_id);
  const poolAssetInfo = assetInfos?.[poolDenom];
  return (
    <Flex gap={1} alignItems="center" flexWrap="wrap">
      Burned at most
      <MsgToken
        coin={{ amount: msg.share_in_max_amount, denom: poolDenom }}
        symbol={poolAssetInfo?.symbol}
        precision={poolAssetInfo?.precision}
        fontWeight={400}
        ampCopierSection={ampCopierSection}
      />
      to
      <PoolLogoLink pool={pool} ampCopierSection={ampCopierSection} />
      <CustomIcon name="arrow-right" boxSize={4} color="accent.main" />
      <MsgToken
        coin={msg.token_out}
        symbol={outAssetInfo?.symbol}
        precision={outAssetInfo?.precision}
        fontWeight={700}
        ampCopierSection={ampCopierSection}
      />
    </Flex>
  );
};

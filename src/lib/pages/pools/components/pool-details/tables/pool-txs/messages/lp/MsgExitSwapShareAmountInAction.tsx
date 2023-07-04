import { Flex } from "@chakra-ui/react";

import { PoolLogoLink } from "../components";
import { getPoolDenom } from "../utils";
import { MsgToken } from "lib/components/action-msg/MsgToken";
import { CustomIcon } from "lib/components/icon";
import type { AssetInfosOpt } from "lib/services/assetService";
import type { PoolDetail } from "lib/types";
import type { MsgExitSwapShareAmountInDetails } from "lib/utils/tx/types";

interface MsgExitSwapShareAmountInActionProps {
  msg: MsgExitSwapShareAmountInDetails;
  pool: PoolDetail;
  assetInfos: AssetInfosOpt;
  ampCopierSection?: string;
}

export const MsgExitSwapShareAmountInAction = ({
  msg,
  pool,
  assetInfos,
  ampCopierSection,
}: MsgExitSwapShareAmountInActionProps) => {
  const outAssetInfo = assetInfos?.[msg.token_out_denom];
  const poolDenom = getPoolDenom(msg.pool_id);
  const poolAssetInfo = assetInfos?.[poolDenom];
  return (
    <Flex gap={1} alignItems="center" flexWrap="wrap">
      Burned
      <MsgToken
        coin={{ amount: msg.share_in_amount, denom: poolDenom }}
        symbol={poolAssetInfo?.symbol}
        precision={poolAssetInfo?.precision}
        fontWeight={700}
        ampCopierSection={ampCopierSection}
      />
      to
      <PoolLogoLink pool={pool} ampCopierSection={ampCopierSection} />
      <CustomIcon name="arrow-right" boxSize={4} color="accent.main" />
      at least
      <MsgToken
        coin={{ amount: msg.token_out_min_amount, denom: msg.token_out_denom }}
        symbol={outAssetInfo?.symbol}
        precision={outAssetInfo?.precision}
        fontWeight={400}
        ampCopierSection={ampCopierSection}
      />
    </Flex>
  );
};

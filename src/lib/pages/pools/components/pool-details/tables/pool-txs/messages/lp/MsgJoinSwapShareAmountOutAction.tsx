import { Flex } from "@chakra-ui/react";

import { PoolLogoLink } from "../components";
import { getPoolDenom } from "../utils";
import { MsgToken } from "lib/components/action-msg/MsgToken";
import { CustomIcon } from "lib/components/icon";
import type { AssetInfosOpt } from "lib/services/assetService";
import type { PoolDetail } from "lib/types";
import type { MsgJoinSwapShareAmountOutDetails } from "lib/utils/tx/types";

interface MsgJoinSwapShareAmountOutActionProps {
  msg: MsgJoinSwapShareAmountOutDetails;
  pool: PoolDetail;
  assetInfos: AssetInfosOpt;
  ampCopierSection?: string;
}

export const MsgJoinSwapShareAmountOutAction = ({
  msg,
  pool,
  assetInfos,
  ampCopierSection,
}: MsgJoinSwapShareAmountOutActionProps) => {
  const inAssetInfo = assetInfos?.[msg.token_in_denom];
  const poolDenom = getPoolDenom(msg.pool_id);
  const poolAssetInfo = assetInfos?.[poolDenom];
  return (
    <Flex gap={1} alignItems="center" flexWrap="wrap">
      Provided at most
      <MsgToken
        coin={{ amount: msg.token_in_max_amount, denom: msg.token_in_denom }}
        symbol={inAssetInfo?.symbol}
        precision={inAssetInfo?.precision}
        fontWeight={400}
        ampCopierSection={ampCopierSection}
      />
      to
      <PoolLogoLink pool={pool} ampCopierSection={ampCopierSection} />
      <CustomIcon name="arrow-right" boxSize={4} color="accent.main" />
      <MsgToken
        coin={{ amount: msg.share_out_amount, denom: poolDenom }}
        symbol={poolAssetInfo?.symbol}
        precision={poolAssetInfo?.precision}
        fontWeight={700}
        ampCopierSection={ampCopierSection}
      />
    </Flex>
  );
};

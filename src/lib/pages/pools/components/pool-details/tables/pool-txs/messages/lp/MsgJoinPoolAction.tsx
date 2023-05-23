import { Flex } from "@chakra-ui/react";

import { PoolLogoLink } from "../components";
import { getPoolDenom } from "../utils";
import { MsgToken } from "lib/components/action-msg/MsgToken";
import { CustomIcon } from "lib/components/icon";
import type { AssetInfosOpt } from "lib/services/assetService";
import type { PoolDetail } from "lib/types";
import type { MsgJoinPoolDetails } from "lib/utils/tx/types";

interface MsgJoinPoolActionProps {
  msg: MsgJoinPoolDetails;
  pool: PoolDetail;
  assetInfos: AssetInfosOpt;
}

export const MsgJoinPoolAction = ({
  msg,
  pool,
  assetInfos,
}: MsgJoinPoolActionProps) => {
  const poolDenom = getPoolDenom(msg.pool_id);
  const poolAssetInfo = assetInfos?.[poolDenom];

  return (
    <Flex gap={1} alignItems="center" flexWrap="wrap">
      Provided{" "}
      {(msg.token_in_maxs ?? []).map((asset, index) => {
        const inAssetInfo = assetInfos?.[asset.denom];
        return (
          <Flex key={asset.denom} gap={1} alignItems="center">
            {index > 0 && (
              <CustomIcon name="plus" boxSize={4} color="lilac.main" />
            )}
            at most
            <MsgToken
              coin={asset}
              symbol={inAssetInfo?.symbol}
              precision={inAssetInfo?.precision}
              fontWeight={400}
            />
          </Flex>
        );
      })}
      to
      <PoolLogoLink pool={pool} />
      <CustomIcon name="arrow-right" boxSize={4} color="honeydew.main" />
      <MsgToken
        coin={{ amount: msg.share_out_amount, denom: poolDenom }}
        symbol={poolAssetInfo?.symbol}
        precision={poolAssetInfo?.precision}
        fontWeight={700}
      />
    </Flex>
  );
};

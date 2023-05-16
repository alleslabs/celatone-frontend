import { Flex } from "@chakra-ui/react";
import type Big from "big.js";

import { PoolLogoLink } from "../components";
import { getPoolDenom } from "../utils";
import { MsgToken } from "lib/components/action-msg/MsgToken";
import { CustomIcon } from "lib/components/icon";
import type { AssetInfosOpt } from "lib/services/assetService";
import type { PoolDetail, TokenWithValue } from "lib/types";
import type { MsgExitPoolDetails } from "lib/utils/tx/types";

interface MsgExitPoolActionProps {
  msg: MsgExitPoolDetails;
  pool: PoolDetail<Big, TokenWithValue>;
  assetInfos: AssetInfosOpt;
}

export const MsgExitPoolAction = ({
  msg,
  pool,
  assetInfos,
}: MsgExitPoolActionProps) => {
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
      />
      from
      <PoolLogoLink pool={pool} />
      <CustomIcon name="arrow-right" boxSize={4} color="honeydew.main" />
      {msg.token_out_mins.map((asset, index) => {
        const outAssetInfo = assetInfos?.[asset.denom];
        return (
          <Flex gap={1} alignItems="center">
            {index > 0 && (
              <CustomIcon name="plus" boxSize={4} color="lilac.main" />
            )}
            at least
            <MsgToken
              coin={asset}
              symbol={outAssetInfo?.symbol}
              precision={outAssetInfo?.precision}
              fontWeight={400}
            />
          </Flex>
        );
      })}
    </Flex>
  );
};

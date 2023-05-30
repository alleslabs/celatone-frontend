import { Flex } from "@chakra-ui/react";

import { PoolLogoLink } from "../components";
import { getPoolDenom } from "../utils";
import { MsgToken } from "lib/components/action-msg/MsgToken";
import { CustomIcon } from "lib/components/icon";
import type { AssetInfosOpt } from "lib/services/assetService";
import type { PoolDetail } from "lib/types";
import type { MsgExitPoolDetails } from "lib/utils/tx/types";

interface MsgExitPoolActionProps {
  msg: MsgExitPoolDetails;
  pool: PoolDetail;
  assetInfos: AssetInfosOpt;
  ampCopierSection?: string;
}

export const MsgExitPoolAction = ({
  msg,
  pool,
  assetInfos,
  ampCopierSection,
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
        ampCopierSection={ampCopierSection}
      />
      from
      <PoolLogoLink pool={pool} ampCopierSection={ampCopierSection} />
      {msg.token_out_mins && (
        <CustomIcon name="arrow-right" boxSize={4} color="honeydew.main" />
      )}
      {(msg.token_out_mins ?? []).map((asset, index) => {
        const outAssetInfo = assetInfos?.[asset.denom];
        return (
          <Flex key={asset.denom} gap={1} alignItems="center">
            {index > 0 && (
              <CustomIcon name="plus" boxSize={4} color="lilac.main" />
            )}
            at least
            <MsgToken
              coin={asset}
              symbol={outAssetInfo?.symbol}
              precision={outAssetInfo?.precision}
              fontWeight={400}
              ampCopierSection={ampCopierSection}
            />
          </Flex>
        );
      })}
    </Flex>
  );
};

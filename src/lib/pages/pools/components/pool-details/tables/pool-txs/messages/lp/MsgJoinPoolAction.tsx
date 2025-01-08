import { Flex } from "@chakra-ui/react";

import { PoolLogoLink } from "../components";
import { getPoolDenom } from "../utils";
import { MsgToken } from "lib/components/action-msg/MsgToken";
import { CustomIcon } from "lib/components/icon";
import type { AssetInfos, Option, PoolData } from "lib/types";
import { coinToTokenWithValue } from "lib/utils";
import type { MsgJoinPoolDetails } from "lib/utils/tx/types";

interface MsgJoinPoolActionProps {
  ampCopierSection?: string;
  assetInfos: Option<AssetInfos>;
  msg: MsgJoinPoolDetails;
  pool: PoolData;
}

export const MsgJoinPoolAction = ({
  ampCopierSection,
  assetInfos,
  msg,
  pool,
}: MsgJoinPoolActionProps) => {
  const poolDenom = getPoolDenom(msg.pool_id);
  const poolToken = coinToTokenWithValue(
    poolDenom,
    msg.share_out_amount,
    assetInfos
  );
  return (
    <Flex alignItems="center" flexWrap="wrap" gap={1}>
      Provided{" "}
      {(msg.token_in_maxs ?? []).map((coin, index) => {
        const token = coinToTokenWithValue(coin.denom, coin.amount, assetInfos);
        return (
          <Flex key={coin.denom} alignItems="center" gap={1}>
            {index > 0 && (
              <CustomIcon name="plus" boxSize={4} color="primary.main" />
            )}
            at most
            <MsgToken
              ampCopierSection={ampCopierSection}
              fontWeight={400}
              token={token}
            />
          </Flex>
        );
      })}
      to
      <PoolLogoLink ampCopierSection={ampCopierSection} pool={pool} />
      <CustomIcon name="arrow-right" boxSize={4} color="primary.main" />
      <MsgToken
        ampCopierSection={ampCopierSection}
        fontWeight={700}
        token={poolToken}
      />
    </Flex>
  );
};

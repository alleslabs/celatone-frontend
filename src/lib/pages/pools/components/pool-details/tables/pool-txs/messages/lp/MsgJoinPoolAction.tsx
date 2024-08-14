import { Flex } from "@chakra-ui/react";

import { PoolLogoLink } from "../components";
import { getPoolDenom } from "../utils";
import { MsgToken } from "lib/components/action-msg/MsgToken";
import { CustomIcon } from "lib/components/icon";
import type { AssetInfos, Option, PoolDetail } from "lib/types";
import { coinToTokenWithValue } from "lib/utils";
import type { MsgJoinPoolDetails } from "lib/utils/tx/types";

interface MsgJoinPoolActionProps {
  msg: MsgJoinPoolDetails;
  pool: PoolDetail;
  assetInfos: Option<AssetInfos>;
  ampCopierSection?: string;
}

export const MsgJoinPoolAction = ({
  msg,
  pool,
  assetInfos,
  ampCopierSection,
}: MsgJoinPoolActionProps) => {
  const poolDenom = getPoolDenom(msg.pool_id);
  const poolToken = coinToTokenWithValue(
    poolDenom,
    msg.share_out_amount,
    assetInfos
  );
  return (
    <Flex gap={1} alignItems="center" flexWrap="wrap">
      Provided{" "}
      {(msg.token_in_maxs ?? []).map((coin, index) => {
        const token = coinToTokenWithValue(coin.denom, coin.amount, assetInfos);
        return (
          <Flex key={coin.denom} gap={1} alignItems="center">
            {index > 0 && (
              <CustomIcon name="plus" boxSize={4} color="primary.main" />
            )}
            at most
            <MsgToken
              token={token}
              fontWeight={400}
              ampCopierSection={ampCopierSection}
            />
          </Flex>
        );
      })}
      to
      <PoolLogoLink pool={pool} ampCopierSection={ampCopierSection} />
      <CustomIcon name="arrow-right" boxSize={4} color="primary.main" />
      <MsgToken
        token={poolToken}
        fontWeight={700}
        ampCopierSection={ampCopierSection}
      />
    </Flex>
  );
};

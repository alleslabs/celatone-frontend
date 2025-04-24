import type { AssetInfos, Option, PoolData } from "lib/types";
import type { MsgExitPoolDetails } from "lib/utils/tx/types";

import { Flex } from "@chakra-ui/react";
import { MsgToken } from "lib/components/action-msg/MsgToken";
import { CustomIcon } from "lib/components/icon";
import { coinToTokenWithValue } from "lib/utils";

import { PoolLogoLink } from "../components";
import { getPoolDenom } from "../utils";

interface MsgExitPoolActionProps {
  ampCopierSection?: string;
  assetInfos: Option<AssetInfos>;
  msg: MsgExitPoolDetails;
  pool: PoolData;
}

export const MsgExitPoolAction = ({
  ampCopierSection,
  assetInfos,
  msg,
  pool,
}: MsgExitPoolActionProps) => {
  const poolDenom = getPoolDenom(msg.pool_id);
  const poolToken = coinToTokenWithValue(
    poolDenom,
    msg.share_in_amount,
    assetInfos
  );
  return (
    <Flex alignItems="center" flexWrap="wrap" gap={1}>
      Burned
      <MsgToken
        ampCopierSection={ampCopierSection}
        fontWeight={700}
        token={poolToken}
      />
      from
      <PoolLogoLink ampCopierSection={ampCopierSection} pool={pool} />
      {msg.token_out_mins && (
        <CustomIcon boxSize={4} color="primary.main" name="arrow-right" />
      )}
      {(msg.token_out_mins ?? []).map((coin, index) => {
        const token = coinToTokenWithValue(coin.denom, coin.amount, assetInfos);
        return (
          <Flex key={token.denom} alignItems="center" gap={1}>
            {index > 0 && (
              <CustomIcon boxSize={4} color="primary.main" name="plus" />
            )}
            at least
            <MsgToken
              ampCopierSection={ampCopierSection}
              fontWeight={400}
              token={token}
            />
          </Flex>
        );
      })}
    </Flex>
  );
};

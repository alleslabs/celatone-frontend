import { Flex } from "@chakra-ui/react";

import { MsgToken } from "lib/components/action-msg/MsgToken";
import { CustomIcon } from "lib/components/icon";
import type { AssetInfos, Option, PoolData } from "lib/types";
import { coinToTokenWithValue } from "lib/utils";
import type { MsgExitPoolDetails } from "lib/utils/tx/types";
import { PoolLogoLink } from "../components";
import { getPoolDenom } from "../utils";

interface MsgExitPoolActionProps {
  msg: MsgExitPoolDetails;
  pool: PoolData;
  assetInfos: Option<AssetInfos>;
  ampCopierSection?: string;
}

export const MsgExitPoolAction = ({
  msg,
  pool,
  assetInfos,
  ampCopierSection,
}: MsgExitPoolActionProps) => {
  const poolDenom = getPoolDenom(msg.pool_id);
  const poolToken = coinToTokenWithValue(
    poolDenom,
    msg.share_in_amount,
    assetInfos
  );
  return (
    <Flex gap={1} alignItems="center" flexWrap="wrap">
      Burned
      <MsgToken
        token={poolToken}
        fontWeight={700}
        ampCopierSection={ampCopierSection}
      />
      from
      <PoolLogoLink pool={pool} ampCopierSection={ampCopierSection} />
      {msg.token_out_mins && (
        <CustomIcon name="arrow-right" boxSize={4} color="primary.main" />
      )}
      {(msg.token_out_mins ?? []).map((coin, index) => {
        const token = coinToTokenWithValue(coin.denom, coin.amount, assetInfos);
        return (
          <Flex key={token.denom} gap={1} alignItems="center">
            {index > 0 && (
              <CustomIcon name="plus" boxSize={4} color="primary.main" />
            )}
            at least
            <MsgToken
              token={token}
              fontWeight={400}
              ampCopierSection={ampCopierSection}
            />
          </Flex>
        );
      })}
    </Flex>
  );
};

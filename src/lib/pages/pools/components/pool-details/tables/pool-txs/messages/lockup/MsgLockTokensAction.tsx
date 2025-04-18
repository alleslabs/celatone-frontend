import type { AssetInfos, Option, PoolData } from "lib/types";
import type { MsgLockTokensDetails } from "lib/utils/tx/types";

import { Flex } from "@chakra-ui/react";
import { MsgToken } from "lib/components/action-msg/MsgToken";
import { coinToTokenWithValue, formatDuration } from "lib/utils";

import { PoolLogoLink } from "../components";
import { getPoolDenom } from "../utils";

interface MsgLockTokensActionProps {
  msg: MsgLockTokensDetails;
  pool: PoolData;
  assetInfos: Option<AssetInfos>;
  ampCopierSection?: string;
}

export const MsgLockTokensAction = ({
  ampCopierSection,
  assetInfos,
  msg,
  pool,
}: MsgLockTokensActionProps) => {
  const poolDenom = getPoolDenom(pool.id.toString());
  const poolAsset = msg.coins.find((coin) => coin.denom === poolDenom) ?? {
    amount: "0",
    denom: poolDenom,
  };
  const poolToken = coinToTokenWithValue(
    poolAsset.denom,
    poolAsset.amount,
    assetInfos
  );
  return (
    <Flex alignItems="center" flexWrap="wrap" gap={1}>
      Bonded
      <MsgToken
        ampCopierSection={ampCopierSection}
        fontWeight={700}
        token={poolToken}
      />
      to
      <PoolLogoLink ampCopierSection={ampCopierSection} pool={pool} />
      with
      <span style={{ fontWeight: 700 }}>{formatDuration(msg.duration)}</span>
      unbonding
    </Flex>
  );
};

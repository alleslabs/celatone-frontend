import { Flex } from "@chakra-ui/react";

import { MsgToken } from "lib/components/action-msg/MsgToken";
import type { AssetInfos, Option, PoolData } from "lib/types";
import { coinToTokenWithValue, formatDuration } from "lib/utils";
import type { MsgLockTokensDetails } from "lib/utils/tx/types";
import { PoolLogoLink } from "../components";
import { getPoolDenom } from "../utils";

interface MsgLockTokensActionProps {
  msg: MsgLockTokensDetails;
  pool: PoolData;
  assetInfos: Option<AssetInfos>;
  ampCopierSection?: string;
}

export const MsgLockTokensAction = ({
  msg,
  pool,
  assetInfos,
  ampCopierSection,
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
    <Flex gap={1} alignItems="center" flexWrap="wrap">
      Bonded
      <MsgToken
        token={poolToken}
        fontWeight={700}
        ampCopierSection={ampCopierSection}
      />
      to
      <PoolLogoLink pool={pool} ampCopierSection={ampCopierSection} />
      with
      <span style={{ fontWeight: 700 }}>{formatDuration(msg.duration)}</span>
      unbonding
    </Flex>
  );
};

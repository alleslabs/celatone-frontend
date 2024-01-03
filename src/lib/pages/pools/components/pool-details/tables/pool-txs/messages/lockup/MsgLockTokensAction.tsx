import { Flex } from "@chakra-ui/react";

import { PoolLogoLink } from "../components";
import { getPoolDenom } from "../utils";
import { MsgToken } from "lib/components/action-msg/MsgToken";
import type { AssetInfos, Option, PoolDetail } from "lib/types";
import { coinToTokenWithValue, formatDuration } from "lib/utils";
import type { MsgLockTokensDetails } from "lib/utils/tx/types";

interface MsgLockTokensActionProps {
  msg: MsgLockTokensDetails;
  pool: PoolDetail;
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

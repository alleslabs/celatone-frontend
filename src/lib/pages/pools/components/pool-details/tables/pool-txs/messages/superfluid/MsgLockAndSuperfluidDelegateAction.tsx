import type { AssetInfos, Option, PoolData } from "lib/types";
import type { MsgLockAndSuperfluidDelegateDetails } from "lib/utils/tx/types";

import { Flex } from "@chakra-ui/react";
import { MsgToken } from "lib/components/action-msg/MsgToken";
import { coinToTokenWithValue } from "lib/utils";

import { PoolLogoLink } from "../components";
import { getPoolDenom } from "../utils";

interface MsgLockAndSuperfluidDelegateActionProps {
  msg: MsgLockAndSuperfluidDelegateDetails;
  pool: PoolData;
  assetInfos: Option<AssetInfos>;
  ampCopierSection?: string;
}

export const MsgLockAndSuperfluidDelegateAction = ({
  ampCopierSection,
  assetInfos,
  msg,
  pool,
}: MsgLockAndSuperfluidDelegateActionProps) => {
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
      Bonded and locked
      <MsgToken
        ampCopierSection={ampCopierSection}
        fontWeight={700}
        token={poolToken}
      />
      to
      <PoolLogoLink ampCopierSection={ampCopierSection} pool={pool} />
      with
      <span style={{ fontWeight: 700 }}>14</span>
      days unbonding
    </Flex>
  );
};

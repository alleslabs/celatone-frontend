import { Flex } from "@chakra-ui/react";

import { PoolLogoLink } from "../components";
import { getPoolDenom } from "../utils";
import { MsgToken } from "lib/components/action-msg/MsgToken";
import type { AssetInfos, Option, PoolData } from "lib/types";
import { coinToTokenWithValue } from "lib/utils";
import type { MsgLockAndSuperfluidDelegateDetails } from "lib/utils/tx/types";

interface MsgLockAndSuperfluidDelegateActionProps {
  msg: MsgLockAndSuperfluidDelegateDetails;
  pool: PoolData;
  assetInfos: Option<AssetInfos>;
  ampCopierSection?: string;
}

export const MsgLockAndSuperfluidDelegateAction = ({
  msg,
  pool,
  assetInfos,
  ampCopierSection,
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
    <Flex gap={1} alignItems="center" flexWrap="wrap">
      Bonded and locked
      <MsgToken
        token={poolToken}
        fontWeight={700}
        ampCopierSection={ampCopierSection}
      />
      to
      <PoolLogoLink pool={pool} ampCopierSection={ampCopierSection} />
      with
      <span style={{ fontWeight: 700 }}>14</span>
      days unbonding
    </Flex>
  );
};

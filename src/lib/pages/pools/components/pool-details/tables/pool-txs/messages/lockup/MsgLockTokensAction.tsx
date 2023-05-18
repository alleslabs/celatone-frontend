import { Flex } from "@chakra-ui/react";
import type Big from "big.js";

import { PoolLogoLink } from "../components";
import { getPoolDenom } from "../utils";
import { MsgToken } from "lib/components/action-msg/MsgToken";
import type { AssetInfosOpt } from "lib/services/assetService";
import type { PoolDetail, TokenWithValue } from "lib/types";
import type { MsgLockTokensDetails } from "lib/utils/tx/types";

interface MsgLockTokensActionProps {
  msg: MsgLockTokensDetails;
  pool: PoolDetail<Big, TokenWithValue>;
  assetInfos: AssetInfosOpt;
}

export const MsgLockTokensAction = ({
  msg,
  pool,
  assetInfos,
}: MsgLockTokensActionProps) => {
  const poolDenom = getPoolDenom(pool.id.toString());
  const poolAsset = msg.coins.find((coin) => coin.denom === poolDenom) ?? {
    amount: "0",
    denom: poolDenom,
  };
  const poolAssetInfo = assetInfos?.[poolDenom];
  return (
    <Flex gap={1} alignItems="center" flexWrap="wrap">
      Bonded
      <MsgToken
        coin={poolAsset}
        symbol={poolAssetInfo?.symbol}
        precision={poolAssetInfo?.precision}
        fontWeight={700}
      />
      to
      <PoolLogoLink pool={pool} />
      with
      <span style={{ fontWeight: 700 }}>
        {Number(msg.duration) / (24 * 60 * 60 * 1e9)}
      </span>
      days unbonding
    </Flex>
  );
};

import { Flex } from "@chakra-ui/react";

import { PoolLogoLink } from "../components";
import { getPoolDenom } from "../utils";
import { MsgToken } from "lib/components/action-msg/MsgToken";
import { CustomIcon } from "lib/components/icon";
import type { AssetInfos, Option, PoolData } from "lib/types";
import { coinToTokenWithValue } from "lib/utils";
import type { MsgExitSwapShareAmountInDetails } from "lib/utils/tx/types";

interface MsgExitSwapShareAmountInActionProps {
  ampCopierSection?: string;
  assetInfos: Option<AssetInfos>;
  msg: MsgExitSwapShareAmountInDetails;
  pool: PoolData;
}

export const MsgExitSwapShareAmountInAction = ({
  ampCopierSection,
  assetInfos,
  msg,
  pool,
}: MsgExitSwapShareAmountInActionProps) => {
  const poolDenom = getPoolDenom(msg.pool_id);
  const poolToken = coinToTokenWithValue(
    poolDenom,
    msg.share_in_amount,
    assetInfos
  );
  const outToken = coinToTokenWithValue(
    msg.token_out_denom,
    msg.token_out_min_amount,
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
      to
      <PoolLogoLink ampCopierSection={ampCopierSection} pool={pool} />
      <CustomIcon name="arrow-right" boxSize={4} color="primary.main" />
      at least
      <MsgToken
        ampCopierSection={ampCopierSection}
        fontWeight={400}
        token={outToken}
      />
    </Flex>
  );
};

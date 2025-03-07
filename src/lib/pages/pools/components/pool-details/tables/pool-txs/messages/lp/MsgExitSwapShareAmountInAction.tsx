import { Flex } from "@chakra-ui/react";

import { MsgToken } from "lib/components/action-msg/MsgToken";
import { CustomIcon } from "lib/components/icon";
import type { AssetInfos, Option, PoolData } from "lib/types";
import { coinToTokenWithValue } from "lib/utils";
import type { MsgExitSwapShareAmountInDetails } from "lib/utils/tx/types";
import { PoolLogoLink } from "../components";
import { getPoolDenom } from "../utils";

interface MsgExitSwapShareAmountInActionProps {
  msg: MsgExitSwapShareAmountInDetails;
  pool: PoolData;
  assetInfos: Option<AssetInfos>;
  ampCopierSection?: string;
}

export const MsgExitSwapShareAmountInAction = ({
  msg,
  pool,
  assetInfos,
  ampCopierSection,
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
    <Flex gap={1} alignItems="center" flexWrap="wrap">
      Burned
      <MsgToken
        token={poolToken}
        fontWeight={700}
        ampCopierSection={ampCopierSection}
      />
      to
      <PoolLogoLink pool={pool} ampCopierSection={ampCopierSection} />
      <CustomIcon name="arrow-right" boxSize={4} color="primary.main" />
      at least
      <MsgToken
        token={outToken}
        fontWeight={400}
        ampCopierSection={ampCopierSection}
      />
    </Flex>
  );
};

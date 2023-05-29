import { Flex } from "@chakra-ui/react";

import { PoolAssetCard } from "../components";
import { PoolInfoText } from "../components/PoolInfoText";
import { getPoolDenom } from "../utils";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { Loading } from "lib/components/Loading";
import { ValidatorBadge } from "lib/components/ValidatorBadge";
import type { AssetInfosOpt } from "lib/services/assetService";
import { useTxData } from "lib/services/txService";
import { useValidator } from "lib/services/validatorService";
import type { PoolDetail } from "lib/types";
import { extractMsgType } from "lib/utils";
import type { MsgLockAndSuperfluidDelegateDetails } from "lib/utils/tx/types";

interface MsgLockAndSuperfluidDelegateDetailProps {
  txHash: string;
  blockHeight: number;
  msgIndex: number;
  msg: MsgLockAndSuperfluidDelegateDetails;
  pool: PoolDetail;
  assetInfos: AssetInfosOpt;
  isOpened: boolean;
}

export const MsgLockAndSuperfluidDelegateDetail = ({
  txHash,
  blockHeight,
  msgIndex,
  msg,
  pool,
  assetInfos,
  isOpened,
}: MsgLockAndSuperfluidDelegateDetailProps) => {
  const poolDenom = getPoolDenom(pool.id.toString());
  const poolAsset = msg.coins.find((coin) => coin.denom === poolDenom) ?? {
    amount: "0",
    denom: poolDenom,
  };
  const poolAssetInfo = assetInfos?.[poolDenom];

  const { data: txData, isLoading: isTxDataLoading } = useTxData(
    txHash,
    isOpened
  );
  const { data: validator, isLoading: isValidatorLoading } = useValidator(
    msg.val_addr,
    isOpened
  );

  if (isTxDataLoading || isValidatorLoading)
    return <Loading withBorder={false} />;

  const lockId = txData?.logs
    .find((event) => event.msg_index === msgIndex)
    ?.events?.find(
      (event) =>
        event.type.includes("lock") &&
        event.attributes.some((attr) => attr.value.includes(poolDenom))
    )
    ?.attributes.at(0)?.value;

  return (
    <Flex w="full" direction="column" gap={6}>
      <Flex gap={12}>
        <PoolInfoText
          title="Block height"
          component={
            <ExplorerLink
              value={blockHeight.toString()}
              type="block_height"
              showCopyOnHover
            />
          }
        />
        <PoolInfoText title="LockID" isText text={lockId} />
        <PoolInfoText
          title="To Validator"
          component={
            <ValidatorBadge
              validator={{
                validatorAddress: msg.val_addr,
                moniker: validator?.moniker,
              }}
              badgeSize={6}
            />
          }
        />
        <PoolInfoText title="Message" isText text={extractMsgType(msg.type)} />
      </Flex>
      <PoolAssetCard
        poolId={pool.id}
        description="Bonded to"
        assetText="Bonded"
        poolAsset={poolAsset}
        poolAssetInfo={poolAssetInfo}
        isOpened={isOpened}
      />
    </Flex>
  );
};

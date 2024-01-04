import { Box, Flex } from "@chakra-ui/react";

import { PoolAssetCard } from "../components";
import { PoolInfoText } from "../components/PoolInfoText";
import { getPoolDenom } from "../utils";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { Loading } from "lib/components/Loading";
import { ValidatorBadge } from "lib/components/ValidatorBadge";
import { useTxData } from "lib/services/txService";
import { useValidator } from "lib/services/validatorService";
import type { AssetInfos, Option, PoolDetail } from "lib/types";
import { coinToTokenWithValue, extractMsgType } from "lib/utils";
import type { MsgLockAndSuperfluidDelegateDetails } from "lib/utils/tx/types";

interface MsgLockAndSuperfluidDelegateDetailProps {
  txHash: string;
  blockHeight: number;
  msgIndex: number;
  msg: MsgLockAndSuperfluidDelegateDetails;
  pool: PoolDetail;
  assetInfos: Option<AssetInfos>;
  isOpened: boolean;
  ampCopierSection?: string;
}

export const MsgLockAndSuperfluidDelegateDetail = ({
  txHash,
  blockHeight,
  msgIndex,
  msg,
  pool,
  assetInfos,
  isOpened,
  ampCopierSection,
}: MsgLockAndSuperfluidDelegateDetailProps) => {
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
    .find((log) => log.msg_index === msgIndex)
    ?.events?.find(
      (event) =>
        event.type.includes("lock") &&
        event.attributes.some((attr) => attr.value.includes(poolDenom))
    )?.attributes[0]?.value;

  return (
    <Flex w="full" direction="column" gap={6}>
      <Flex gap={12}>
        <PoolInfoText title="Block height">
          <ExplorerLink
            value={blockHeight.toString()}
            type="block_height"
            showCopyOnHover
            ampCopierSection={ampCopierSection}
          />
        </PoolInfoText>
        <PoolInfoText title="LockID">{lockId}</PoolInfoText>
        <PoolInfoText title="To Validator">
          <ValidatorBadge
            validator={{
              validatorAddress: msg.val_addr,
              moniker: validator?.moniker,
              identity: undefined,
            }}
            badgeSize={6}
            ampCopierSection={ampCopierSection}
          />
        </PoolInfoText>
        <PoolInfoText title="Message">{extractMsgType(msg.type)}</PoolInfoText>
      </Flex>
      <Box w="full">
        <PoolAssetCard
          poolId={pool.id}
          description="Bonded to"
          assetText="Bonded"
          poolToken={poolToken}
          assetInfos={assetInfos}
          isOpened={isOpened}
          ampCopierSection={ampCopierSection}
        />
      </Box>
    </Flex>
  );
};

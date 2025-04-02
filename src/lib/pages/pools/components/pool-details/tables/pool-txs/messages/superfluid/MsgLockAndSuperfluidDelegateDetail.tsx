import type { AssetInfos, Option, PoolData } from "lib/types";
import type { MsgLockAndSuperfluidDelegateDetails } from "lib/utils/tx/types";

import { Box, Flex } from "@chakra-ui/react";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { Loading } from "lib/components/Loading";
import { ValidatorBadge } from "lib/components/ValidatorBadge";
import { useTxData } from "lib/services/tx";
import { useValidatorDataRest } from "lib/services/validator";
import { coinToTokenWithValue, extractMsgType } from "lib/utils";

import {
  ErrorFetchingDetail,
  PoolAssetCard,
  PoolInfoText,
} from "../components";
import { getPoolDenom } from "../utils";

interface MsgLockAndSuperfluidDelegateDetailProps {
  txHash: string;
  blockHeight: number;
  msgIndex: number;
  msg: MsgLockAndSuperfluidDelegateDetails;
  pool: PoolData;
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
  const { data: validator, isLoading: isValidatorLoading } =
    useValidatorDataRest(msg.val_addr, isOpened);

  if (isTxDataLoading || isValidatorLoading)
    return <Loading withBorder={false} />;
  if (!txData) return <ErrorFetchingDetail />;

  const msgEvents = txData.logs.find(
    (log) => log.msg_index === msgIndex
  )?.events;

  const lockId = msgEvents
    ?.find((event) => event.type === "lock_tokens")
    ?.attributes.find((attr) => attr.key === "period_lock_id")?.value;

  return (
    <Flex direction="column" gap={6} w="full">
      <Flex gap={12}>
        <PoolInfoText title="Block height">
          <ExplorerLink
            ampCopierSection={ampCopierSection}
            showCopyOnHover
            type="block_height"
            value={blockHeight.toString()}
          />
        </PoolInfoText>
        <PoolInfoText title="LockID">{lockId}</PoolInfoText>
        <PoolInfoText title="To Validator">
          <ValidatorBadge
            ampCopierSection={ampCopierSection}
            badgeSize={6}
            validator={{
              validatorAddress: msg.val_addr,
              moniker: validator?.moniker,
              identity: undefined,
            }}
          />
        </PoolInfoText>
        <PoolInfoText title="Message">{extractMsgType(msg.type)}</PoolInfoText>
      </Flex>
      <Box w="full">
        <PoolAssetCard
          ampCopierSection={ampCopierSection}
          assetInfos={assetInfos}
          assetText="Bonded"
          description="Bonded to"
          isOpened={isOpened}
          poolId={pool.id}
          poolToken={poolToken}
        />
      </Box>
    </Flex>
  );
};

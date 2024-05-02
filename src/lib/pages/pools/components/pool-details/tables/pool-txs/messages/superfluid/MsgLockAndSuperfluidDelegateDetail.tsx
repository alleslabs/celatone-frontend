import { Box, Flex } from "@chakra-ui/react";

import {
  ErrorFetchingDetail,
  PoolAssetCard,
  PoolInfoText,
} from "../components";
import { getPoolDenom } from "../utils";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { Loading } from "lib/components/Loading";
import { ValidatorBadge } from "lib/components/ValidatorBadge";
import { useValidator } from "lib/services/validatorService";
import { useTxData } from "lib/services/wasm/txs";
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
  if (!txData) return <ErrorFetchingDetail />;

  const msgEvents = txData.logs.find(
    (log) => log.msg_index === msgIndex
  )?.events;

  const lockId = msgEvents
    ?.find((event) => event.type === "lock_tokens")
    ?.attributes.find((attr) => attr.key === "period_lock_id")?.value;

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

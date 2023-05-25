import { Box, Flex, Text } from "@chakra-ui/react";

import { PoolAssetCard } from "../components";
import { getPoolDenom } from "../utils";
import { MsgToken } from "lib/components/action-msg/MsgToken";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { Loading } from "lib/components/Loading";
import type { AssetInfosOpt } from "lib/services/assetService";
import { useTxData } from "lib/services/txService";
import type { PoolDetail } from "lib/types";
import type { MsgLockTokensDetails } from "lib/utils/tx/types";

interface MsgLockTokensDetailProps {
  txHash: string;
  blockHeight: number;
  msgIndex: number;
  msg: MsgLockTokensDetails;
  pool: PoolDetail;
  assetInfos: AssetInfosOpt;
  isOpened: boolean;
  ampCopierSection?: string;
}

export const MsgLockTokensDetail = ({
  txHash,
  blockHeight,
  msgIndex,
  msg,
  pool,
  assetInfos,
  isOpened,
  ampCopierSection,
}: MsgLockTokensDetailProps) => {
  const poolDenom = getPoolDenom(pool.id.toString());
  const poolAsset = msg.coins.find((coin) => coin.denom === poolDenom) ?? {
    amount: "0",
    denom: poolDenom,
  };
  const poolAssetInfo = assetInfos?.[poolDenom];

  const { data: txData, isLoading } = useTxData(txHash, isOpened);
  if (isLoading) return <Loading withBorder={false} />;

  const lockId = txData?.logs
    .find((event) => event.msg_index === msgIndex)
    ?.events?.find(
      (event) =>
        event.type.includes("lock") &&
        event.attributes.some((attr) => attr.value.includes(poolDenom))
    )
    ?.attributes.at(0)?.value;

  return (
    <Flex w="full" direction="column" gap={4}>
      <Flex gap={12}>
        <Flex direction="column" gap={1}>
          <Text variant="body2" textColor="pebble.500" fontWeight={500}>
            Block height
          </Text>
          <ExplorerLink
            value={blockHeight.toString()}
            type="block_height"
            showCopyOnHover
            ampCopierSection={ampCopierSection}
          />
        </Flex>
        <Flex direction="column" gap={1}>
          <Text variant="body2" textColor="pebble.500" fontWeight={500}>
            LockID
          </Text>
          <Text variant="body2">{lockId}</Text>
        </Flex>
        <Flex direction="column" gap={1}>
          <Text variant="body2" textColor="pebble.500" fontWeight={500}>
            Bonded LP
          </Text>
          <MsgToken
            coin={poolAsset}
            symbol={poolAssetInfo?.symbol}
            precision={poolAssetInfo?.precision}
            fontWeight={700}
            ampCopierSection={ampCopierSection}
          />
        </Flex>
      </Flex>
      <Box w="full">
        <PoolAssetCard
          poolId={pool.id}
          description="Bonded to"
          assetText="Bonded"
          poolAsset={poolAsset}
          poolAssetInfo={poolAssetInfo}
          isOpened={isOpened}
          ampCopierSection={ampCopierSection}
        />
      </Box>
    </Flex>
  );
};

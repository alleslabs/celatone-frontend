import { Flex, Text } from "@chakra-ui/react";

import { getPoolDenom } from "../../utils";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { Loading } from "lib/components/Loading";
import { EmptyState } from "lib/components/state";
import { PoolLogo } from "lib/pages/pools/components/PoolLogo";
import type { AssetInfosOpt } from "lib/services/assetService";
import { usePoolAssetsbyPoolIds } from "lib/services/poolService";
import { useTxData } from "lib/services/txService";
import type { TokenWithValue } from "lib/types";
import {
  coinToTokenWithValue,
  formatBalanceWithDenom,
  getTokenLabel,
} from "lib/utils";

interface PoolAssetCardProps {
  txHash?: string;
  msgIndex: number;
  poolId: string;
  msgShareAmount?: string;
  assetInfos: AssetInfosOpt;
  isJoin: boolean;
  isOpened: boolean;
}

export const PoolAssetCard = ({
  txHash,
  msgIndex,
  poolId,
  msgShareAmount,
  assetInfos,
  isJoin,
  isOpened,
}: PoolAssetCardProps) => {
  const { data: txData, isLoading: isTxDataLoading } = useTxData(
    txHash,
    isOpened
  );
  const { data: poolAssets, isLoading: isPoolAssetsLoading } =
    usePoolAssetsbyPoolIds([Number(poolId)], isOpened);

  if (!msgShareAmount && (isTxDataLoading || isPoolAssetsLoading))
    return <Loading />;

  const poolDenom = getPoolDenom(poolId);
  const eventShareAmount = txData?.logs
    .find((event) => event.msg_index === msgIndex)
    ?.events?.find((event) => event.type === "coin_received")
    ?.attributes.at(3)
    ?.value.slice(0, -poolDenom.length);

  const shareAmount = msgShareAmount ?? eventShareAmount;
  if (!shareAmount || !poolAssets)
    return (
      <EmptyState message="There is an error during fetching pool detail." />
    );

  const tokens = poolAssets[Number(poolId)].map<TokenWithValue>((denom) =>
    coinToTokenWithValue(denom, "0", assetInfos?.[denom])
  );
  return (
    <Flex
      className="pool-msg-detail-container"
      direction="column"
      gap={2}
      p={4}
      border="1px solid"
      borderColor="transparent"
      borderRadius="8px"
      bgColor="pebble.900"
    >
      <Flex justifyContent="space-between">
        <Text variant="body2" textColor="text.dark">
          {isJoin ? "Provided to" : "Removed from"}
        </Text>
        <Text>
          {isJoin ? "Received " : "Burn "}
          <span style={{ fontWeight: 700 }}>
            {formatBalanceWithDenom({
              coin: { amount: shareAmount, denom: poolDenom },
              symbol: assetInfos?.[poolDenom]?.symbol,
              precision: assetInfos?.[poolDenom]?.precision,
            })}
          </span>
        </Text>
      </Flex>
      <Flex
        alignItems="center"
        gap={3}
        px={3}
        py={2}
        borderRadius="8px"
        background="pebble.800"
      >
        <PoolLogo
          tokens={tokens}
          logoSize={5}
          marginLeft={-4}
          minW="fit-content"
          textVariant="small"
        />
        <div>
          <Flex
            gap={1}
            css={{
              "p:last-of-type > span": {
                display: "none",
              },
            }}
          >
            {tokens.map((token) => (
              <Text
                key={token.denom}
                variant="body2"
                fontWeight={400}
                color="text.main"
              >
                {token.symbol || getTokenLabel(token.denom)}
                <Text as="span" fontWeight={400} color="honeydew.main">
                  {" "}
                  /
                </Text>
              </Text>
            ))}
          </Flex>
          <ExplorerLink
            type="pool_id"
            value={poolId.toString()}
            showCopyOnHover
          />
        </div>
      </Flex>
    </Flex>
  );
};

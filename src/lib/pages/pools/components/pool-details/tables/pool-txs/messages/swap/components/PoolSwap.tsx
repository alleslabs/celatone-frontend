import type { Event } from "@cosmjs/stargate";
import type { Coin } from "cosmjs-types/cosmos/base/v1beta1/coin";
import type { AssetInfos, Option } from "lib/types";

import { Flex, Grid, Text } from "@chakra-ui/react";
import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import { useTxData } from "lib/services/tx";
import { coinsFromStr } from "lib/utils";

import { AssetCard, ErrorFetchingDetail } from "../../components";

interface ExactInput {
  amount: Coin;
  expectedDenom: string;
  isExactIn: boolean;
}

interface PoolSwapInterface {
  ampCopierSection?: string;
  assetInfos: Option<AssetInfos>;
  exactInput: ExactInput;
  isOpened: boolean;
  msgIndex: number;
  txHash: string;
}

const getAssets = (
  exactInput: ExactInput,
  msgEvents: Option<readonly Event[]>
): { inAsset: Coin; outAsset: Coin } => {
  if (exactInput.isExactIn) {
    return {
      inAsset: exactInput.amount,
      outAsset: coinsFromStr(
        msgEvents
          ?.findLast((event) => event.type === "coin_received")
          ?.attributes.find((attr) => attr.key === "amount")?.value ??
          `0${exactInput.expectedDenom}`
      )[0],
    };
  }
  return {
    inAsset: coinsFromStr(
      msgEvents
        ?.find((event) => event.type === "coin_spent")
        ?.attributes.find((attr) => attr.key === "amount")?.value ??
        `0${exactInput.expectedDenom}`
    )[0],
    outAsset: exactInput.amount,
  };
};

export const PoolSwap = ({
  ampCopierSection,
  assetInfos,
  exactInput,
  isOpened,
  msgIndex,
  txHash,
}: PoolSwapInterface) => {
  const { data: txData, isLoading } = useTxData(txHash, isOpened);
  if (isLoading) return <Loading withBorder={false} />;
  if (!txData) return <ErrorFetchingDetail />;

  const msgEvents = txData.logs.find(
    (log) => log.msg_index === msgIndex
  )?.events;

  const { inAsset, outAsset } = getAssets(exactInput, msgEvents);
  return (
    <Grid
      alignItems="center"
      gap={4}
      mb={6}
      templateColumns="minmax(250px, 1fr) 24px minmax(250px, 1fr)"
    >
      <Flex direction="column">
        <Text fontWeight={500} textColor="gray.500" variant="body2">
          From
        </Text>
        <AssetCard
          amount={inAsset.amount}
          ampCopierSection={ampCopierSection}
          assetInfo={assetInfos?.[inAsset.denom]}
          denom={inAsset.denom}
        />
      </Flex>
      <CustomIcon boxSize={4} color="primary.main" name="arrow-right" />
      <Flex direction="column">
        <Text fontWeight={500} textColor="gray.500" variant="body2">
          To
        </Text>
        <AssetCard
          amount={outAsset.amount}
          ampCopierSection={ampCopierSection}
          assetInfo={assetInfos?.[outAsset.denom]}
          denom={outAsset.denom}
        />
      </Flex>
    </Grid>
  );
};

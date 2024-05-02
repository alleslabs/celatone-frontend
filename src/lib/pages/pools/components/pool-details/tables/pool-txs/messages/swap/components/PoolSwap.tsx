import { Grid, Text } from "@chakra-ui/react";
import type { Event } from "@cosmjs/stargate";
import type { Coin } from "cosmjs-types/cosmos/base/v1beta1/coin";

import { AssetCard, ErrorFetchingDetail } from "../../components";
import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import { useTxData } from "lib/services/wasm/txs";
import type { AssetInfos, Option } from "lib/types";
import { coinsFromStr } from "lib/utils";

interface ExactInput {
  isExactIn: boolean;
  amount: Coin;
  expectedDenom: string;
}

interface PoolSwapInterface {
  txHash: string;
  exactInput: ExactInput;
  msgIndex: number;
  assetInfos: Option<AssetInfos>;
  isOpened: boolean;
  ampCopierSection?: string;
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
  txHash,
  exactInput,
  msgIndex,
  assetInfos,
  isOpened,
  ampCopierSection,
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
      gap={4}
      alignItems="center"
      mb={6}
      templateColumns="minmax(250px, 1fr) 24px minmax(250px, 1fr)"
    >
      <div>
        <Text variant="body2" textColor="gray.500" fontWeight={500}>
          From
        </Text>
        <AssetCard
          amount={inAsset.amount}
          denom={inAsset.denom}
          assetInfo={assetInfos?.[inAsset.denom]}
          ampCopierSection={ampCopierSection}
        />
      </div>
      <CustomIcon name="arrow-right" boxSize={4} color="accent.main" />
      <div>
        <Text variant="body2" textColor="gray.500" fontWeight={500}>
          To
        </Text>
        <AssetCard
          amount={outAsset.amount}
          denom={outAsset.denom}
          assetInfo={assetInfos?.[outAsset.denom]}
          ampCopierSection={ampCopierSection}
        />
      </div>
    </Grid>
  );
};

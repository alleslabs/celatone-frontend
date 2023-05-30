import { Grid, Text } from "@chakra-ui/react";

import { AssetCard } from "../../components";
import { coinsFromStr } from "../../utils";
import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import { EmptyState } from "lib/components/state";
import type { AssetInfosOpt } from "lib/services/assetService";
import { useTxData } from "lib/services/txService";

interface PoolSwapInterface {
  txHash: string;
  msgIndex: number;
  assetInfos: AssetInfosOpt;
  isOpened: boolean;
  ampCopierSection?: string;
}

export const PoolSwap = ({
  txHash,
  msgIndex,
  assetInfos,
  isOpened,
  ampCopierSection,
}: PoolSwapInterface) => {
  const { data: txData, isLoading } = useTxData(txHash, isOpened);
  if (isLoading) return <Loading withBorder={false} />;

  const swapEvent = txData?.logs
    .find((log) => log.msg_index === msgIndex)
    ?.events?.find((event) => event.type === "token_swapped");
  if (!swapEvent)
    return (
      <EmptyState message="There is an error during fetching message detail." />
    );

  // Get the token-in from the third attribute of the event e.g. 10000utoken
  const inAsset = swapEvent.attributes.at(3)?.value ?? "";
  const { amount: inAmount, denom: inDenom } = coinsFromStr(inAsset)[0];

  // Get the token-out from the last attribute of the event e.g. 10000utoken
  const outAsset = swapEvent.attributes.at(-1)?.value ?? "";
  const { amount: outAmount, denom: outDenom } = coinsFromStr(outAsset)[0];

  return (
    <Grid
      gap={4}
      alignItems="center"
      mb={6}
      templateColumns="minmax(250px, 1fr) 24px minmax(250px, 1fr)"
    >
      <div>
        <Text variant="body2" textColor="pebble.500" fontWeight={500}>
          From
        </Text>
        <AssetCard
          amount={inAmount}
          denom={inDenom}
          assetInfo={assetInfos?.[inDenom]}
          ampCopierSection={ampCopierSection}
        />
      </div>
      <CustomIcon name="arrow-right" boxSize={4} color="honeydew.main" />
      <div>
        <Text variant="body2" textColor="pebble.500" fontWeight={500}>
          To
        </Text>
        <AssetCard
          amount={outAmount}
          denom={outDenom}
          assetInfo={assetInfos?.[outDenom]}
          ampCopierSection={ampCopierSection}
        />
      </div>
    </Grid>
  );
};

import { Grid, Text } from "@chakra-ui/react";

import { AssetCard, ErrorFetchingDetail } from "../../components";
import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import { useTxData } from "lib/services/txService";
import type { AssetInfos, Option } from "lib/types";
import { coinsFromStr } from "lib/utils";

interface PoolSwapInterface {
  txHash: string;
  msgIndex: number;
  assetInfos: Option<AssetInfos>;
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
  if (!txData) return <ErrorFetchingDetail />;

  const msgEvents = txData.logs.find(
    (log) => log.msg_index === msgIndex
  )?.events;

  // Get the token-in from the third attribute of the event e.g. 10000utoken
  const inAsset =
    msgEvents
      ?.find((event) => event.type === "token_swapped")
      ?.attributes.find((attr) => attr.key === "tokens_in")?.value ?? "";
  const { amount: inAmount, denom: inDenom } = coinsFromStr(inAsset)[0];

  // Get the token-out from the last attribute of the event e.g. 10000utoken
  const outAsset =
    msgEvents
      ?.findLast((event) => event.type === "token_swapped")
      ?.attributes.findLast((attr) => attr.key === "tokens_out")?.value ?? "";
  const { amount: outAmount, denom: outDenom } = coinsFromStr(outAsset)[0];

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
          amount={inAmount}
          denom={inDenom}
          assetInfo={assetInfos?.[inDenom]}
          ampCopierSection={ampCopierSection}
        />
      </div>
      <CustomIcon name="arrow-right" boxSize={4} color="accent.main" />
      <div>
        <Text variant="body2" textColor="gray.500" fontWeight={500}>
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

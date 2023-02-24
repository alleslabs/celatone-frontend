import { Flex, Grid, Text } from "@chakra-ui/react";

import { Loading } from "lib/components/Loading";
import { UnsupportedTokensModal } from "lib/components/modal/UnsupportedTokensModal";
import { ViewMore } from "lib/components/table/ViewMore";
import { TokenCard } from "lib/components/TokenCard";
import { useTotalValue } from "lib/hooks";
import { useUserAssetInfos } from "lib/pages/account-details/data";
import type { BalanceWithAssetInfo, HumanAddr, Option } from "lib/types";
import { formatPrice } from "lib/utils";

import { UserAssetInfoCard } from "./UserAssetInfo";

interface AssetsSectionProps {
  walletAddress: HumanAddr;
  onViewMore?: () => void;
}

interface AssetSectionContentProps {
  supportedAssets: Option<BalanceWithAssetInfo[]>;
  onViewMore?: () => void;
  error: Error;
}

const MaxAssetsShow = 12;

const AssetSectionContent = ({
  supportedAssets,
  onViewMore,
  error,
}: AssetSectionContentProps) => {
  if (error)
    return (
      <Text variant="body2" color="text.dark">
        Error fetching assets data.
      </Text>
    );

  return supportedAssets?.length ? (
    <Grid gridGap={4} gridTemplateColumns="repeat(4, 1fr)">
      {supportedAssets
        .slice(0, onViewMore ? MaxAssetsShow : undefined)
        .map((asset) => (
          <TokenCard userBalance={asset} key={asset.balance.id} />
        ))}
    </Grid>
  ) : (
    <Text variant="body2" color="text.dark">
      This address does not hold any supported assets
    </Text>
  );
};
export const AssetsSection = ({
  walletAddress,
  onViewMore,
}: AssetsSectionProps) => {
  const { supportedAssets, unsupportedAssets, isLoading, error } =
    useUserAssetInfos(walletAddress);

  const totalValue = useTotalValue(supportedAssets);

  if (isLoading) return <Loading />;

  return (
    <Flex direction="column" gap={4} mt={12} mb={4}>
      <Flex justify="space-between" width="full" align="center">
        <Flex gap="50px">
          <UserAssetInfoCard
            value={totalValue ? formatPrice(totalValue) : "N/A"}
            isZeroValue={totalValue ? totalValue.eq(0) : false}
            helperText="Total Value"
          />
          <UserAssetInfoCard
            value={supportedAssets ? supportedAssets?.length.toString() : "N/A"}
            isZeroValue={supportedAssets?.length === 0}
            helperText="Holding Supported Assets"
          />
        </Flex>
        {unsupportedAssets && (
          <Flex>
            <UnsupportedTokensModal
              unsupportedAssets={unsupportedAssets}
              address={walletAddress}
            />
          </Flex>
        )}
      </Flex>
      <AssetSectionContent
        supportedAssets={supportedAssets}
        onViewMore={onViewMore}
        error={error}
      />
      {supportedAssets &&
        onViewMore &&
        supportedAssets.length >= MaxAssetsShow && (
          <ViewMore onClick={onViewMore} />
        )}
    </Flex>
  );
};

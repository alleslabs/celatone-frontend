import { Flex, Grid, Text } from "@chakra-ui/react";
import type { Big } from "big.js";
import big from "big.js";

import { Loading } from "lib/components/Loading";
import { UnsupportedTokensModal } from "lib/components/modal";
import { TableTitle, ViewMore } from "lib/components/table";
import { TokenCard } from "lib/components/TokenCard";
import { useUserAssetInfos } from "lib/pages/account-details/data";
import type { BalanceWithAssetInfo, HumanAddr, Option, USD } from "lib/types";
import { calTotalValue, formatPrice } from "lib/utils";

import { UserAssetInfoCard } from "./UserAssetInfoCard";

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

  let totalValue = big(0) as USD<Big>;
  if (supportedAssets) totalValue = calTotalValue(supportedAssets);

  if (isLoading) return <Loading />;

  return (
    <Flex direction="column" gap={4} mt={8} pb={8} width="full">
      {onViewMore && (
        <TableTitle
          title="Assets"
          count={
            (supportedAssets?.length || 0) + (unsupportedAssets?.length || 0)
          }
          mb={0}
        />
      )}
      <Flex justify="space-between" width="full" align="center">
        <Flex gap="50px">
          <UserAssetInfoCard
            value={
              totalValue && supportedAssets ? formatPrice(totalValue) : "N/A"
            }
            isZeroValue={totalValue.eq(0) || !supportedAssets}
            helperText="Total Asset Value"
          />
          <UserAssetInfoCard
            value={supportedAssets ? supportedAssets.length.toString() : "N/A"}
            isZeroValue={!supportedAssets?.length}
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
        supportedAssets.length > MaxAssetsShow && (
          <ViewMore onClick={onViewMore} />
        )}
    </Flex>
  );
};

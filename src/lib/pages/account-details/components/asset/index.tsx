import { Button, Flex, Grid, Text } from "@chakra-ui/react";
import type { Big } from "big.js";
import big from "big.js";

import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import { UnsupportedTokensModal } from "lib/components/modal";
import { TableTitle, ViewMore } from "lib/components/table";
import { TokenCard } from "lib/components/TokenCard";
import { useOpenAssetTab } from "lib/hooks/useOpenAssetTab";
import { useUserAssetInfos } from "lib/pages/account-details/data";
import { AmpTrackViewJson } from "lib/services/amplitude";
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
          <TokenCard userBalance={asset} key={asset.balance.id} minW="full" />
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
  const openAssetTab = useOpenAssetTab();
  const { supportedAssets, unsupportedAssets, isLoading, error } =
    useUserAssetInfos(walletAddress);

  let totalValue = big(0) as USD<Big>;
  if (supportedAssets) totalValue = calTotalValue(supportedAssets);

  if (isLoading) return <Loading />;

  const totalAsset =
    (supportedAssets?.length || 0) + (unsupportedAssets?.length || 0);

  return (
    <Flex direction="column" gap={4} my={8} width="full">
      {onViewMore && <TableTitle title="Assets" count={totalAsset} mb={0} />}
      <Flex justify="space-between" width="full" align="center">
        <Flex gap={12}>
          <UserAssetInfoCard
            value={
              totalValue && supportedAssets ? formatPrice(totalValue) : "N/A"
            }
            isZeroValue={totalValue.eq(0) || !supportedAssets}
            helperText="Total Asset Value"
          />
        </Flex>
        <Flex>
          {totalAsset > 0 && (
            <Button
              variant="ghost-gray"
              size="sm"
              rightIcon={
                <CustomIcon name="launch" boxSize={3} color="text.dark" />
              }
              onClick={() => {
                AmpTrackViewJson("account_details_page_assets");
                openAssetTab(walletAddress);
              }}
            >
              View in JSON
            </Button>
          )}
          {unsupportedAssets && (
            <UnsupportedTokensModal
              unsupportedAssets={unsupportedAssets}
              address={walletAddress}
            />
          )}
        </Flex>
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

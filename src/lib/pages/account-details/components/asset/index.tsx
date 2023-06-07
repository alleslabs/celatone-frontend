import { Flex, Grid, Text } from "@chakra-ui/react";
import type { Big } from "big.js";
import big from "big.js";

import { useMobile } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
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
    <Grid
      gridGap={4}
      gridTemplateColumns={{ base: "1 fr", md: "repeat(4, 1fr)" }}
    >
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

const AssetTitle = ({
  onViewMore,
  assetCount,
  children,
}: {
  onViewMore: AssetsSectionProps["onViewMore"];
  assetCount: number;
  children: JSX.Element;
}) => {
  const isMobile = useMobile();

  if (!isMobile && !onViewMore) return null;

  if (isMobile && onViewMore)
    return (
      <Flex
        justify="space-between"
        w="full"
        bg="gray.900"
        borderRadius="8px"
        p={4}
        onClick={onViewMore}
      >
        <Flex direction="column" gap={2}>
          <TableTitle title="Assets" count={assetCount} mb={0} />
          {children}
        </Flex>
        <CustomIcon name="chevron-right" color="gray.600" />
      </Flex>
    );

  return <TableTitle title="Assets" count={assetCount} mb={0} />;
};

export const AssetsSection = ({
  walletAddress,
  onViewMore,
}: AssetsSectionProps) => {
  const { supportedAssets, unsupportedAssets, isLoading, error } =
    useUserAssetInfos(walletAddress);

  let totalValue = big(0) as USD<Big>;
  if (supportedAssets) totalValue = calTotalValue(supportedAssets);

  const isMobile = useMobile();
  const TotalAssetValueInfo = (
    <UserAssetInfoCard
      value={totalValue && supportedAssets ? formatPrice(totalValue) : "N/A"}
      isZeroValue={totalValue.eq(0) || !supportedAssets}
      helperText="Total Asset Value"
    />
  );
  let isMobileDetail = null;
  if (isMobile && onViewMore) {
    isMobileDetail = false;
  } else {
    isMobileDetail = true;
  }
  if (isLoading) return <Loading />;
  return (
    <Flex
      direction="column"
      gap={4}
      mt={{ base: 4, md: 8 }}
      mb={{ base: 0, md: 8 }}
      width="full"
    >
      <AssetTitle
        onViewMore={onViewMore}
        assetCount={
          (supportedAssets?.length ?? 0) + (unsupportedAssets?.length ?? 0)
        }
      >
        {TotalAssetValueInfo}
      </AssetTitle>
      {isMobileDetail && (
        <>
          <Flex justify="space-between" width="full" align="center">
            <Flex gap="50px">{TotalAssetValueInfo}</Flex>
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
        </>
      )}
      {!isMobile ||
        (supportedAssets &&
          onViewMore &&
          supportedAssets.length > MaxAssetsShow && (
            <ViewMore onClick={onViewMore} />
          ))}
    </Flex>
  );
};

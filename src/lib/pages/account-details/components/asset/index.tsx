import { Flex, Grid, Text, Button } from "@chakra-ui/react";

import { trackUseViewJSON } from "lib/amplitude";
import { useMobile } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import { UnsupportedTokensModal } from "lib/components/modal";
import { TableTitle, ViewMore } from "lib/components/table";
import { TokenCard } from "lib/components/token/TokenCard";
import { useOpenAssetTab } from "lib/hooks";
import { useUserAssetInfos } from "lib/pages/account-details/data";
import type { Addr, Option, TokenWithValue } from "lib/types";
import { formatPrice } from "lib/utils";

import { UserAssetInfoCard } from "./UserAssetInfoCard";

interface AssetsSectionProps {
  address: Addr;
  onViewMore?: () => void;
}

interface AssetSectionContentProps {
  supportedAssets: Option<TokenWithValue[]>;
  onViewMore?: () => void;
  error: Error;
}

interface AssetCtaProps {
  unsupportedAssets: Option<TokenWithValue[]>;
  totalAsset: number;
  address: Addr;
}

const MAX_ASSETS_SHOW = 8;

const AssetTitle = ({
  onViewMore,
  totalAsset,
  children,
}: {
  onViewMore: AssetsSectionProps["onViewMore"];
  totalAsset: number;
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
          <TableTitle title="Assets" count={totalAsset} mb={0} />
          {children}
        </Flex>
        <CustomIcon name="chevron-right" color="gray.600" />
      </Flex>
    );

  return <TableTitle title="Assets" count={totalAsset} mb={0} />;
};

const AssetCta = ({
  unsupportedAssets,
  totalAsset,
  address,
}: AssetCtaProps) => {
  const openAssetTab = useOpenAssetTab();

  return (
    <Flex
      w={{ base: "full", md: "auto" }}
      justify="center"
      mb={{ base: 4, md: 0 }}
    >
      {totalAsset > 0 && (
        <Button
          variant="ghost-gray"
          size="sm"
          rightIcon={<CustomIcon name="launch" boxSize={3} color="text.dark" />}
          onClick={() => {
            trackUseViewJSON("account_details_page_assets");
            openAssetTab(address);
          }}
        >
          View in JSON
        </Button>
      )}
      {unsupportedAssets && (
        <UnsupportedTokensModal
          unsupportedAssets={unsupportedAssets}
          address={address}
          addressType="user_address"
        />
      )}
    </Flex>
  );
};
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
        .slice(0, onViewMore ? MAX_ASSETS_SHOW : undefined)
        .map((asset) => (
          <TokenCard key={asset.denom} token={asset} minW="full" />
        ))}
    </Grid>
  ) : (
    <Text variant="body2" color="text.dark">
      This address does not hold any supported assets
    </Text>
  );
};

export const AssetsSection = ({ address, onViewMore }: AssetsSectionProps) => {
  const isMobile = useMobile();
  const {
    supportedAssets,
    totalSupportedAssetsValue,
    unsupportedAssets,
    isLoading,
    totalData = 0,
    error,
  } = useUserAssetInfos(address);
  const isMobileOverview = isMobile && !!onViewMore;

  if (isLoading) return <Loading withBorder />;

  const TotalAssetValueInfo = (
    <UserAssetInfoCard
      value={
        totalSupportedAssetsValue
          ? formatPrice(totalSupportedAssetsValue)
          : "N/A"
      }
      isZeroValue={
        !totalSupportedAssetsValue || totalSupportedAssetsValue.eq(0)
      }
      helperText="Total Asset Value"
    />
  );

  return (
    <Flex
      direction="column"
      gap={4}
      mt={{ base: 4, md: 8 }}
      mb={{ base: 0, md: 8 }}
      width="full"
    >
      <AssetTitle onViewMore={onViewMore} totalAsset={totalData}>
        {TotalAssetValueInfo}
      </AssetTitle>
      {!isMobileOverview && (
        <>
          <Flex
            justify={{ base: "flex-start", md: "space-between" }}
            width="full"
            align={{ base: "start", md: "center" }}
            direction={{ base: "column", md: "row" }}
          >
            <Flex gap="50px">{TotalAssetValueInfo}</Flex>
            {!isMobile && (
              <AssetCta
                unsupportedAssets={unsupportedAssets}
                address={address}
                totalAsset={totalData}
              />
            )}
          </Flex>
          <AssetSectionContent
            supportedAssets={supportedAssets}
            onViewMore={onViewMore}
            error={error}
          />
          {isMobile && (
            <AssetCta
              unsupportedAssets={unsupportedAssets}
              address={address}
              totalAsset={totalData}
            />
          )}
          {onViewMore &&
            supportedAssets &&
            supportedAssets.length > MAX_ASSETS_SHOW && (
              <ViewMore onClick={onViewMore} />
            )}
        </>
      )}
    </Flex>
  );
};

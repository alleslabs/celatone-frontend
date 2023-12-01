import { Flex } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import { TableTitle, ViewMore } from "lib/components/table";
import { useUserAssetInfos } from "lib/pages/account-details/data";
import type { Addr } from "lib/types";

import { AssetCta } from "./AssetCta";
import { AssetSectionContent } from "./AssetSectionContent";
import { UserAssetInfoCard } from "./UserAssetInfoCard";

const MAX_ASSETS_SHOW = 8;

interface AssetsSectionProps {
  address: Addr;
  onViewMore?: () => void;
}

export const AssetsSection = ({ address, onViewMore }: AssetsSectionProps) => {
  const isMobile = useMobile();
  const isMobileOverview = isMobile && !!onViewMore;

  const {
    supportedAssets,
    totalSupportedAssetsValue,
    unsupportedAssets,
    isLoading,
    totalData = 0,
    error,
  } = useUserAssetInfos(address);

  if (isLoading) return <Loading withBorder />;

  const tableTitle = <TableTitle title="Assets" count={totalData} mb={0} />;
  const totalAssetValueInfo = (
    <UserAssetInfoCard
      totalSupportedAssetsValue={totalSupportedAssetsValue}
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
      {isMobileOverview ? (
        <Flex
          justify="space-between"
          w="full"
          bg="gray.900"
          borderRadius="8px"
          p={4}
          onClick={onViewMore}
        >
          <Flex direction="column" gap={2}>
            {tableTitle}
            {totalAssetValueInfo}
          </Flex>
          <CustomIcon name="chevron-right" color="gray.600" />
        </Flex>
      ) : (
        <>
          {isMobile && tableTitle}
          <Flex
            justify={{ base: "flex-start", md: "space-between" }}
            width="full"
            align={{ base: "start", md: "center" }}
            direction={{ base: "column", md: "row" }}
          >
            {totalAssetValueInfo}
            {!isMobile && (
              <AssetCta
                unsupportedAssets={unsupportedAssets}
                address={address}
                totalAsset={totalData}
              />
            )}
          </Flex>
          <AssetSectionContent
            supportedAssets={
              onViewMore
                ? supportedAssets.slice(0, MAX_ASSETS_SHOW)
                : supportedAssets
            }
            error={error}
          />
          {isMobile && (
            <AssetCta
              unsupportedAssets={unsupportedAssets}
              address={address}
              totalAsset={totalData}
            />
          )}
          {onViewMore && supportedAssets.length > MAX_ASSETS_SHOW && (
            <ViewMore onClick={onViewMore} />
          )}
        </>
      )}
    </Flex>
  );
};

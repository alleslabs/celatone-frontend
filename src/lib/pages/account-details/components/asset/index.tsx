import { Flex } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import { TableTitle, ViewMore } from "lib/components/table";
import { useBalanceInfos } from "lib/services/balanceService";
import type { BechAddr } from "lib/types";

import { AssetCta } from "./AssetCta";
import { AssetSectionContent } from "./AssetSectionContent";
import { UserAssetInfoCard } from "./UserAssetInfoCard";

const MAX_ASSETS_SHOW = 8;

interface AssetsSectionProps {
  address: BechAddr;
  onViewMore?: () => void;
  isAccount?: boolean;
}

export const AssetsSection = ({
  address,
  onViewMore,
  isAccount = false,
}: AssetsSectionProps) => {
  const isMobile = useMobile();
  const isMobileOverview = isMobile && !!onViewMore;

  const {
    supportedAssets,
    totalSupportedAssetsValue,
    unsupportedAssets,
    isLoading,
    totalData = 0,
    error,
  } = useBalanceInfos(address);

  if (isLoading) return <Loading />;

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
      mt={{ base: isMobileOverview ? 0 : 4, md: 4 }}
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
          {tableTitle}
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
            isAccount={isAccount}
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

import { Button, Flex, Heading, Text } from "@chakra-ui/react";

import { trackUseViewJSON } from "lib/amplitude";
import { useMobile } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import { TableTitle, ViewMore } from "lib/components/table";
import { useOpenAssetTab } from "lib/hooks";
import { useBalanceInfos } from "lib/services/balanceService";
import type { BechAddr } from "lib/types";

import { SupportedAssetSectionContent } from "./SupportedAssetSectionContent";
import { UnsupportedAssetSectionContent } from "./UnsupportedAssetSectionContent";
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
  const openAssetTab = useOpenAssetTab();
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

  const totalSupportedAssets = supportedAssets.length;
  const totalUnsupportedAssets = unsupportedAssets.length;

  const totalAssetValueInfo = (
    <UserAssetInfoCard
      totalSupportedAssetsValue={totalSupportedAssetsValue}
      helperText="Total Asset Value"
    />
  );

  const totalSupportedAssetsInfo = (
    <Flex direction="column" width="fit-content">
      <Text variant="body2" fontWeight={500} color="text.dark">
        Supported Assets
      </Text>
      <Heading
        mt={1}
        as="h6"
        variant="h6"
        color={totalSupportedAssets > 0 ? "text.dark" : "text.main"}
      >
        {totalSupportedAssets > 0 ? totalSupportedAssets : "0"}
      </Heading>
    </Flex>
  );

  const totalUnsupportedAssetsInfo = (
    <Flex direction="column" width="fit-content">
      <Text variant="body2" fontWeight={500} color="text.dark">
        Unsupported Assets
      </Text>
      <Heading
        mt={1}
        as="h6"
        variant="h6"
        color={totalUnsupportedAssets > 0 ? "text.dark" : "text.main"}
      >
        {totalUnsupportedAssets > 0 ? totalUnsupportedAssets : "0"}
      </Heading>
    </Flex>
  );

  const supportedTitle = (
    <Flex w="full" justifyContent="space-between">
      <TableTitle
        title="Supported Assets"
        count={totalSupportedAssets}
        mb={0}
      />
    </Flex>
  );

  const unsupportedTitle = (
    <Flex w="full" justifyContent="space-between" mt={4}>
      <TableTitle
        title="Unsupported Assets"
        count={totalUnsupportedAssets}
        mb={0}
      />
    </Flex>
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
            {supportedTitle}
            <Flex>
              {totalAssetValueInfo}
              {totalSupportedAssetsInfo}
              {totalUnsupportedAssetsInfo}
            </Flex>
          </Flex>
          <CustomIcon name="chevron-right" color="gray.600" />
        </Flex>
      ) : (
        <>
          <Flex w="full" justifyContent="space-between">
            <TableTitle title="Assets" count={totalData} mb={0} />
            <Button
              variant="ghost-gray"
              size="sm"
              rightIcon={
                <CustomIcon name="launch" boxSize={3} color="text.dark" />
              }
              onClick={() => {
                trackUseViewJSON("account_details_page_assets");
                openAssetTab(address);
              }}
            >
              View all assets in JSON
            </Button>
          </Flex>
          <Flex
            p={onViewMore ? 0 : 4}
            border={onViewMore ? "0px" : "1px solid"}
            borderColor="gray.700"
            gap={4}
            borderRadius="8px"
            direction="column"
          >
            {!onViewMore && supportedTitle}
            <Flex
              width="full"
              gap={8}
              align={{ base: "start", md: "center" }}
              direction={{ base: "column", md: "row" }}
            >
              {totalAssetValueInfo}
              {totalSupportedAssetsInfo}
              {totalUnsupportedAssetsInfo}
            </Flex>
            <SupportedAssetSectionContent
              isAccount={isAccount}
              supportedAssets={
                onViewMore
                  ? supportedAssets.slice(0, MAX_ASSETS_SHOW)
                  : supportedAssets
              }
              error={error}
            />
          </Flex>
          {!onViewMore && (
            <>
              {unsupportedTitle}
              <UnsupportedAssetSectionContent
                unsupportedAssets={unsupportedAssets}
              />
            </>
          )}
          {onViewMore && supportedAssets.length > MAX_ASSETS_SHOW && (
            <ViewMore onClick={onViewMore} />
          )}
        </>
      )}
    </Flex>
  );
};

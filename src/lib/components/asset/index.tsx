import { Button, Flex, Heading, Text } from "@chakra-ui/react";

import { trackUseViewJSON } from "lib/amplitude";
import { useMobile } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import { TableTitle } from "lib/components/table";
import { useOpenAssetTab } from "lib/hooks";
import { useBalanceInfos } from "lib/services/balanceService";
import type { BechAddr } from "lib/types";
import { formatPrice } from "lib/utils";

import { AssetSectionOverview } from "./AssetSectionOverview";
import { SupportedAssetSectionContent } from "./SupportedAssetSectionContent";
import { SupportedAssetTitle } from "./SupportedAssetTitle";
import { UnsupportedAssetSectionContent } from "./UnsupportedAssetSectionContent";
import { UnsupportedAssetTitle } from "./UnsupportedAssetTitle";
import { UserAssetInfoCard } from "./UserAssetInfoCard";

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
  const openAssetTab = useOpenAssetTab();
  const isMobileOverview = isMobile && !!onViewMore;

  const {
    supportedAssets,
    totalSupportedAssetsValue,
    unsupportedAssets,
    totalData = 0,
    isLoading,
    error,
  } = useBalanceInfos(address);

  if (isLoading) return <Loading />;

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
            <TableTitle
              title="Supported Assets"
              count={supportedAssets.length}
              mb={0}
            />
            <UserAssetInfoCard
              totalSupportedAssetsValue={totalSupportedAssetsValue}
              helperText="Total Asset Value"
            />
          </Flex>
          <CustomIcon name="chevron-right" color="gray.600" />
        </Flex>
      ) : (
        <>
          <Flex w="full" justifyContent="space-between">
            <TableTitle title="Assets" count={totalData} mb={0} />
            <Button
              disabled={!supportedAssets.length && !unsupportedAssets.length}
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
          {onViewMore ? (
            <AssetSectionOverview
              isAccount={isAccount}
              supportedAssets={supportedAssets}
              totalSupportedAssetsValue={totalSupportedAssetsValue}
              unsupportedAssets={unsupportedAssets}
              error={error}
              onViewMore={onViewMore}
            />
          ) : (
            <>
              <Flex
                border="1px solid"
                borderColor="gray.700"
                borderRadius="8px"
                direction="column"
              >
                <SupportedAssetTitle
                  supportedAssets={supportedAssets}
                  totalSupportedAssetsValue={totalSupportedAssetsValue}
                />
                {isMobile && (
                  <Flex pt={4} px={4} direction="column">
                    <Text variant="body2" color="text.dark">
                      Total Asset Value
                    </Text>
                    <Heading as="h6" variant="h6" color="text.main">
                      {totalSupportedAssetsValue
                        ? formatPrice(totalSupportedAssetsValue)
                        : "N/A"}
                    </Heading>
                  </Flex>
                )}
                <SupportedAssetSectionContent
                  isAccount={isAccount}
                  supportedAssets={supportedAssets}
                  error={error}
                />
              </Flex>
              <Flex
                border="1px solid"
                borderColor="gray.700"
                borderRadius="8px"
                direction="column"
                mt={2}
              >
                <UnsupportedAssetTitle unsupportedAssets={unsupportedAssets} />
                <UnsupportedAssetSectionContent
                  isAccount={isAccount}
                  unsupportedAssets={unsupportedAssets}
                />
              </Flex>
            </>
          )}
        </>
      )}
    </Flex>
  );
};

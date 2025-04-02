import type Big from "big.js";
import type { BechAddr, Option, TokenWithValue, USD } from "lib/types";

import { Button, Divider, Flex, Heading, Text } from "@chakra-ui/react";
import { trackUseViewJSON } from "lib/amplitude";
import { useMobile } from "lib/app-provider";
import { useOpenAssetTab } from "lib/hooks";
import { useBalanceInfos } from "lib/services/bank";
import { formatPrice } from "lib/utils";

import { CustomIcon } from "../icon";
import { Loading } from "../Loading";
import { ErrorFetching } from "../state";
import { TableTitle } from "../table";
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

const MobileOverview = ({
  supportedAssets,
  totalSupportedAssetsValue,
  unsupportedAssets,
  hasNoAsset,
  onViewMore,
}: {
  supportedAssets: TokenWithValue[];
  totalSupportedAssetsValue: Option<USD<Big>>;
  unsupportedAssets: TokenWithValue[];
  hasNoAsset: boolean;
  onViewMore: () => void;
}) => (
  <Flex
    bg="gray.900"
    borderRadius="8px"
    justify="space-between"
    opacity={hasNoAsset ? 0.5 : 1}
    p={4}
    w="full"
    onClick={hasNoAsset ? undefined : onViewMore}
  >
    <Flex direction="column" gap={2}>
      <TableTitle
        count={supportedAssets.length + unsupportedAssets.length}
        mb={0}
        title="Assets"
      />
      <UserAssetInfoCard
        helperText="Total Asset Value"
        totalSupportedAssetsValue={totalSupportedAssetsValue}
      />
    </Flex>
    <CustomIcon color="gray.600" name="chevron-right" />
  </Flex>
);

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

  const isZeroValue =
    !totalSupportedAssetsValue || totalSupportedAssetsValue.eq(0);

  const hasNoAsset = !supportedAssets.length && !unsupportedAssets.length;
  if (isLoading) return <Loading />;
  if (error)
    return (
      <ErrorFetching
        dataName="balances"
        hasBorderTop={false}
        my={2}
        withBorder
      />
    );

  return (
    <Flex
      direction="column"
      gap={4}
      mb={{ base: 0, md: 8 }}
      mt={{ base: isMobileOverview ? 0 : 8, md: 4 }}
      width="full"
    >
      {isMobileOverview ? (
        <MobileOverview
          hasNoAsset={hasNoAsset}
          supportedAssets={supportedAssets}
          totalSupportedAssetsValue={totalSupportedAssetsValue}
          unsupportedAssets={unsupportedAssets}
          onViewMore={onViewMore}
        />
      ) : (
        <>
          <Flex justifyContent="space-between" w="full">
            <TableTitle count={totalData} mb={0} title="Assets" />
            <Button
              isDisabled={hasNoAsset}
              rightIcon={
                <CustomIcon boxSize={3} color="text.dark" name="launch" />
              }
              size="sm"
              variant="ghost-gray"
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
              onViewMore={onViewMore}
            />
          ) : (
            <>
              <Flex direction="column">
                <SupportedAssetTitle
                  supportedAssets={supportedAssets}
                  totalSupportedAssetsValue={totalSupportedAssetsValue}
                />
                <Divider borderColor="gray.700" />
                {isMobile && (
                  <Flex direction="column" pt={4} px={4}>
                    <Text color="text.dark" variant="body2">
                      Total Asset Value
                    </Text>
                    <Heading
                      as="h6"
                      color={isZeroValue ? "text.dark" : "text.main"}
                      variant="h6"
                    >
                      {totalSupportedAssetsValue
                        ? formatPrice(totalSupportedAssetsValue)
                        : "N/A"}
                    </Heading>
                  </Flex>
                )}
                <SupportedAssetSectionContent
                  isAccount={isAccount}
                  supportedAssets={supportedAssets}
                />
                {!supportedAssets.length && <Divider borderColor="gray.700" />}
              </Flex>
              <Flex direction="column" mt={2}>
                <UnsupportedAssetTitle unsupportedAssets={unsupportedAssets} />
                <Divider borderColor="gray.700" />
                <UnsupportedAssetSectionContent
                  isAccount={isAccount}
                  unsupportedAssets={unsupportedAssets}
                />
                {!unsupportedAssets.length && (
                  <Divider borderColor="gray.700" />
                )}
              </Flex>
            </>
          )}
        </>
      )}
    </Flex>
  );
};

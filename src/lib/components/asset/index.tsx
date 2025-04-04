import { Button, Divider, Flex, Heading, Text } from "@chakra-ui/react";
import type Big from "big.js";

import { trackUseViewJSON } from "lib/amplitude";
import { useMobile } from "lib/app-provider";
import { useOpenAssetTab } from "lib/hooks";
import { useBalanceInfos } from "lib/services/bank";
import type { BechAddr, Option, TokenWithValue, USD } from "lib/types";
import { formatPrice } from "lib/utils";

import { AssetSectionOverview } from "./AssetSectionOverview";
import { SupportedAssetSectionContent } from "./SupportedAssetSectionContent";
import { SupportedAssetTitle } from "./SupportedAssetTitle";
import { UnsupportedAssetSectionContent } from "./UnsupportedAssetSectionContent";
import { UnsupportedAssetTitle } from "./UnsupportedAssetTitle";
import { UserAssetInfoCard } from "./UserAssetInfoCard";
import { CustomIcon } from "../icon";
import { Loading } from "../Loading";
import { ErrorFetching } from "../state";
import { TableTitle } from "../table";

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
    justify="space-between"
    w="full"
    bg="gray.900"
    borderRadius="8px"
    p={4}
    opacity={hasNoAsset ? 0.5 : 1}
    onClick={hasNoAsset ? undefined : onViewMore}
  >
    <Flex direction="column" gap={2}>
      <TableTitle
        title="Assets"
        count={supportedAssets.length + unsupportedAssets.length}
        mb={0}
      />
      <UserAssetInfoCard
        totalSupportedAssetsValue={totalSupportedAssetsValue}
        helperText="Total asset value"
      />
    </Flex>
    <CustomIcon name="chevron-right" color="gray.600" />
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
        withBorder
        my={2}
        hasBorderTop={false}
      />
    );

  return (
    <Flex
      direction="column"
      gap={4}
      mt={{ base: isMobileOverview ? 0 : 8, md: 4 }}
      mb={{ base: 0, md: 8 }}
      width="full"
    >
      {isMobileOverview ? (
        <MobileOverview
          supportedAssets={supportedAssets}
          totalSupportedAssetsValue={totalSupportedAssetsValue}
          unsupportedAssets={unsupportedAssets}
          hasNoAsset={hasNoAsset}
          onViewMore={onViewMore}
        />
      ) : (
        <>
          <Flex w="full" justifyContent="space-between">
            <TableTitle title="Assets" count={totalData} mb={0} />
            <Button
              isDisabled={hasNoAsset}
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
                  <Flex pt={4} px={4} direction="column">
                    <Text variant="body2" color="text.dark">
                      Total asset value
                    </Text>
                    <Heading
                      as="h6"
                      variant="h6"
                      color={isZeroValue ? "text.dark" : "text.main"}
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

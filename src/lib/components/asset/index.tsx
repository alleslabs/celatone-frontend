import { Button, Divider, Flex, Heading, Text } from "@chakra-ui/react";
import type Big from "big.js";

import { CustomIcon } from "../icon";
import { Loading } from "../Loading";
import { ErrorFetching } from "../state";
import { TableTitle } from "../table";
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

interface AssetsSectionProps {
  address: BechAddr;
  isAccount?: boolean;
  onViewMore?: () => void;
}

const MobileOverview = ({
  hasNoAsset,
  onViewMore,
  supportedAssets,
  totalSupportedAssetsValue,
  unsupportedAssets,
}: {
  hasNoAsset: boolean;
  onViewMore: () => void;
  supportedAssets: TokenWithValue[];
  totalSupportedAssetsValue: Option<USD<Big>>;
  unsupportedAssets: TokenWithValue[];
}) => (
  <Flex
    bg="gray.900"
    justify="space-between"
    p={4}
    w="full"
    borderRadius="8px"
    onClick={hasNoAsset ? undefined : onViewMore}
    opacity={hasNoAsset ? 0.5 : 1}
  >
    <Flex gap={2} direction="column">
      <TableTitle
        mb={0}
        title="Assets"
        count={supportedAssets.length + unsupportedAssets.length}
      />
      <UserAssetInfoCard
        helperText="Total Asset Value"
        totalSupportedAssetsValue={totalSupportedAssetsValue}
      />
    </Flex>
    <CustomIcon name="chevron-right" color="gray.600" />
  </Flex>
);

export const AssetsSection = ({
  address,
  isAccount = false,
  onViewMore,
}: AssetsSectionProps) => {
  const isMobile = useMobile();
  const openAssetTab = useOpenAssetTab();
  const isMobileOverview = isMobile && !!onViewMore;

  const {
    error,
    isLoading,
    supportedAssets,
    totalData = 0,
    totalSupportedAssetsValue,
    unsupportedAssets,
  } = useBalanceInfos(address);

  const isZeroValue =
    !totalSupportedAssetsValue || totalSupportedAssetsValue.eq(0);

  const hasNoAsset = !supportedAssets.length && !unsupportedAssets.length;
  if (isLoading) return <Loading />;
  if (error)
    return (
      <ErrorFetching
        dataName="balances"
        my={2}
        hasBorderTop={false}
        withBorder
      />
    );

  return (
    <Flex
      width="full"
      gap={4}
      mb={{ base: 0, md: 8 }}
      mt={{ base: isMobileOverview ? 0 : 8, md: 4 }}
      direction="column"
    >
      {isMobileOverview ? (
        <MobileOverview
          hasNoAsset={hasNoAsset}
          onViewMore={onViewMore}
          supportedAssets={supportedAssets}
          totalSupportedAssetsValue={totalSupportedAssetsValue}
          unsupportedAssets={unsupportedAssets}
        />
      ) : (
        <>
          <Flex w="full" justifyContent="space-between">
            <TableTitle mb={0} title="Assets" count={totalData} />
            <Button
              isDisabled={hasNoAsset}
              size="sm"
              variant="ghost-gray"
              onClick={() => {
                trackUseViewJSON("account_details_page_assets");
                openAssetTab(address);
              }}
              rightIcon={
                <CustomIcon name="launch" boxSize={3} color="text.dark" />
              }
            >
              View all assets in JSON
            </Button>
          </Flex>
          {onViewMore ? (
            <AssetSectionOverview
              isAccount={isAccount}
              onViewMore={onViewMore}
              supportedAssets={supportedAssets}
              totalSupportedAssetsValue={totalSupportedAssetsValue}
              unsupportedAssets={unsupportedAssets}
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
                      Total Asset Value
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
              <Flex mt={2} direction="column">
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

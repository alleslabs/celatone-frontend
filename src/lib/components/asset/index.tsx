import { Button, Flex, Grid, GridItem, Heading, Text } from "@chakra-ui/react";

import { trackUseViewJSON } from "lib/amplitude";
import { useMobile } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import { TableTitle, ViewMore } from "lib/components/table";
import { useOpenAssetTab } from "lib/hooks";
import { useBalanceInfos } from "lib/services/balanceService";
import type { BechAddr } from "lib/types";
import { formatPrice } from "lib/utils";

import { SupportedAssetSectionContent } from "./SupportedAssetSectionContent";
import { UnsupportedAssetSectionContent } from "./UnsupportedAssetSectionContent";
import { UserAssetInfoCard } from "./UserAssetInfoCard";

const MAX_SUPPORTED_ASSETS_SHOW = 6;
const MAX_UNSUPPORTED_ASSETS_SHOW = 3;

interface AssetsSectionProps {
  address: BechAddr;
  onViewMore?: () => void;
  isAccount?: boolean;
}

const MainTitle = ({
  address,
  isDisabled,
}: {
  address: BechAddr;
  isDisabled: boolean;
}) => {
  const openAssetTab = useOpenAssetTab();
  const { totalData = 0 } = useBalanceInfos(address);

  return (
    <Flex w="full" justifyContent="space-between">
      <TableTitle title="Assets" count={totalData} mb={0} />
      <Button
        disabled={isDisabled}
        variant="ghost-gray"
        size="sm"
        rightIcon={<CustomIcon name="launch" boxSize={3} color="text.dark" />}
        onClick={() => {
          trackUseViewJSON("account_details_page_assets");
          openAssetTab(address);
        }}
      >
        View all assets in JSON
      </Button>
    </Flex>
  );
};

const SupportedAssetTitle = ({ address }: { address: BechAddr }) => {
  const { supportedAssets, totalSupportedAssetsValue } =
    useBalanceInfos(address);
  const isMobile = useMobile();
  const isZeroValue =
    !totalSupportedAssetsValue || totalSupportedAssetsValue.eq(0);
  const totalSupportedAssets = supportedAssets.length;
  return (
    <Flex
      w="full"
      bg="gray.900"
      py={2}
      px={4}
      borderRadius="8px 8px 0px 0px"
      justifyContent="space-between"
    >
      <TableTitle
        title="Supported Assets"
        count={totalSupportedAssets}
        mb={0}
      />
      {!isMobile && (
        <Heading
          mt={1}
          as="h6"
          variant="h6"
          color={isZeroValue ? "text.dark" : "text.main"}
        >
          {totalSupportedAssetsValue
            ? formatPrice(totalSupportedAssetsValue)
            : "N/A"}
        </Heading>
      )}
    </Flex>
  );
};

const UnsupportedAssetTitle = ({ address }: { address: BechAddr }) => {
  const { unsupportedAssets } = useBalanceInfos(address);

  const totalUnsupportedAssets = unsupportedAssets.length;
  return (
    <Flex w="full" bg="gray.900" py={2} px={4} borderRadius="8px 8px 0px 0px">
      <TableTitle
        title="Unsupported Assets"
        count={totalUnsupportedAssets}
        mb={0}
      />
    </Flex>
  );
};

const OverviewSection = ({
  address,
  isAccount,
  onViewMore,
}: {
  address: BechAddr;
  isAccount: boolean;
  onViewMore: () => void;
}) => {
  const { supportedAssets, unsupportedAssets, error } =
    useBalanceInfos(address);

  return supportedAssets.length || unsupportedAssets.length ? (
    <Grid gridTemplateColumns={{ base: "1fr", xl: "2fr 1fr" }} gridGap={4}>
      <GridItem border="1px solid" borderColor="gray.700" borderRadius="8px">
        <Flex direction="column" justifyContent="space-between" h="full">
          <Flex direction="column">
            <SupportedAssetTitle address={address} />
            {supportedAssets.length ? (
              <SupportedAssetSectionContent
                isAccount={isAccount}
                supportedAssets={supportedAssets.slice(
                  0,
                  MAX_SUPPORTED_ASSETS_SHOW
                )}
                error={error}
                onViewMore={onViewMore}
              />
            ) : (
              <Flex
                w="full"
                alignItems="center"
                justifyContent="center"
                h="calc(100% - 45px)"
                minH={20}
              >
                <Text variant="body2" color="text.dark">
                  This {isAccount ? "address" : "contract"} does not hold any
                  supported assets
                </Text>
              </Flex>
            )}
          </Flex>
          {onViewMore && supportedAssets.length > MAX_SUPPORTED_ASSETS_SHOW && (
            <ViewMore
              onClick={onViewMore}
              borderRadius="0px 0px 8px 8px"
              minH="48px"
            />
          )}
        </Flex>
      </GridItem>
      <GridItem border="1px solid" borderColor="gray.700" borderRadius="8px">
        <UnsupportedAssetTitle address={address} />
        {unsupportedAssets.length ? (
          <UnsupportedAssetSectionContent
            isAccount={isAccount}
            unsupportedAssets={unsupportedAssets.slice(
              0,
              MAX_UNSUPPORTED_ASSETS_SHOW
            )}
            onViewMore={onViewMore}
          />
        ) : (
          <Flex
            w="full"
            alignItems="center"
            justifyContent="center"
            h="calc(100% - 45px)"
            minH={20}
          >
            <Text variant="body2" color="text.dark">
              This {isAccount ? "address" : "contract"} does not hold any
              unsupported assets
            </Text>
          </Flex>
        )}
        {onViewMore &&
          unsupportedAssets.length > MAX_UNSUPPORTED_ASSETS_SHOW && (
            <ViewMore
              onClick={onViewMore}
              borderRadius="0px 0px 8px 8px"
              minH="48px"
            />
          )}
      </GridItem>
    </Grid>
  ) : (
    <Text variant="body2" color="text.dark">
      This {isAccount ? "address" : "contract"} does not hold any assets
    </Text>
  );
};

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
    error,
  } = useBalanceInfos(address);

  if (isLoading) return <Loading />;

  const totalSupportedAssets = supportedAssets.length;

  const totalAssetValueInfo = (
    <UserAssetInfoCard
      totalSupportedAssetsValue={totalSupportedAssetsValue}
      helperText="Total Asset Value"
    />
  );

  const supportedTitleMobile = (
    <TableTitle title="Supported Assets" count={totalSupportedAssets} mb={0} />
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
            {supportedTitleMobile}
            <Flex>{totalAssetValueInfo}</Flex>
          </Flex>
          <CustomIcon name="chevron-right" color="gray.600" />
        </Flex>
      ) : (
        <>
          <MainTitle
            address={address}
            isDisabled={!supportedAssets.length && !unsupportedAssets.length}
          />
          {onViewMore ? (
            <OverviewSection
              address={address}
              isAccount={isAccount}
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
                <SupportedAssetTitle address={address} />
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
                <UnsupportedAssetTitle address={address} />
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

import { Flex, Grid, GridItem, Text } from "@chakra-ui/react";

import { ViewMore } from "../table";
import type { Option, TokenWithValue, USD } from "lib/types";

import { SupportedAssetSectionContent } from "./SupportedAssetSectionContent";
import { SupportedAssetTitle } from "./SupportedAssetTitle";
import { UnsupportedAssetSectionContent } from "./UnsupportedAssetSectionContent";
import { UnsupportedAssetTitle } from "./UnsupportedAssetTitle";

const MAX_SUPPORTED_ASSETS_SHOW = 6;
const MAX_UNSUPPORTED_ASSETS_SHOW = 3;

interface AssetSectionOverviewProps {
  isAccount: boolean;
  supportedAssets: TokenWithValue[];
  totalSupportedAssetsValue: Option<USD<Big>>;
  unsupportedAssets: TokenWithValue[];
  onViewMore: () => void;
}

export const AssetSectionOverview = ({
  isAccount,
  supportedAssets,
  totalSupportedAssetsValue,
  unsupportedAssets,
  onViewMore,
}: AssetSectionOverviewProps) => {
  if (!supportedAssets.length && !unsupportedAssets.length)
    return (
      <Text variant="body2" color="text.dark">
        This {isAccount ? "address" : "contract"} does not hold any assets
      </Text>
    );

  return (
    <Grid gridTemplateColumns={{ base: "1fr", xl: "1fr 1fr" }} gridGap={12}>
      <GridItem>
        <Flex direction="column" justifyContent="space-between" h="full">
          <Flex direction="column">
            <SupportedAssetTitle
              supportedAssets={supportedAssets}
              totalSupportedAssetsValue={totalSupportedAssetsValue}
            />
            <Flex borderTop="1px solid" borderColor="gray.700" w="full" />
            <SupportedAssetSectionContent
              isAccount={isAccount}
              supportedAssets={supportedAssets.slice(
                0,
                MAX_SUPPORTED_ASSETS_SHOW
              )}
              onViewMore={onViewMore}
            />
          </Flex>
          {onViewMore && supportedAssets.length > MAX_SUPPORTED_ASSETS_SHOW && (
            <ViewMore onClick={onViewMore} borderRadius="8px" minH="48px" />
          )}
        </Flex>
      </GridItem>
      <GridItem>
        <UnsupportedAssetTitle unsupportedAssets={unsupportedAssets} />
        <Flex borderTop="1px solid" borderColor="gray.700" w="full" />
        <UnsupportedAssetSectionContent
          isAccount={isAccount}
          unsupportedAssets={unsupportedAssets.slice(
            0,
            MAX_UNSUPPORTED_ASSETS_SHOW
          )}
          onViewMore={onViewMore}
        />
        {onViewMore &&
          unsupportedAssets.length > MAX_UNSUPPORTED_ASSETS_SHOW && (
            <ViewMore onClick={onViewMore} borderRadius="8px" minH="48px" />
          )}
      </GridItem>
    </Grid>
  );
};

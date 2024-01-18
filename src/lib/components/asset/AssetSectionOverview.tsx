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
    <Grid gridTemplateColumns={{ base: "1fr", xl: "2fr 1fr" }} gridGap={4}>
      <GridItem border="1px solid" borderColor="gray.700" borderRadius="8px">
        <Flex direction="column" justifyContent="space-between" h="full">
          <Flex direction="column">
            <SupportedAssetTitle
              supportedAssets={supportedAssets}
              totalSupportedAssetsValue={totalSupportedAssetsValue}
            />
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
            <ViewMore
              onClick={onViewMore}
              borderRadius="0px 0px 8px 8px"
              minH="48px"
            />
          )}
        </Flex>
      </GridItem>
      <GridItem border="1px solid" borderColor="gray.700" borderRadius="8px">
        <UnsupportedAssetTitle unsupportedAssets={unsupportedAssets} />
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
            <ViewMore
              onClick={onViewMore}
              borderRadius="0px 0px 8px 8px"
              minH="48px"
            />
          )}
      </GridItem>
    </Grid>
  );
};

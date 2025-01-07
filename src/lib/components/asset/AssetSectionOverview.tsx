import { Divider, Flex, Grid, GridItem, Text } from "@chakra-ui/react";

import { ViewMore } from "../table";
import type { Option, TokenWithValue, USD } from "lib/types";

import { SupportedAssetSectionContent } from "./SupportedAssetSectionContent";
import { SupportedAssetTitle } from "./SupportedAssetTitle";
import { UnsupportedAssetSectionContent } from "./UnsupportedAssetSectionContent";
import { UnsupportedAssetTitle } from "./UnsupportedAssetTitle";

const MAX_SUPPORTED_ASSETS_SHOW = 4;
const MAX_UNSUPPORTED_ASSETS_SHOW = 3;

interface AssetSectionOverviewProps {
  isAccount: boolean;
  onViewMore: () => void;
  supportedAssets: TokenWithValue[];
  totalSupportedAssetsValue: Option<USD<Big>>;
  unsupportedAssets: TokenWithValue[];
}

export const AssetSectionOverview = ({
  isAccount,
  onViewMore,
  supportedAssets,
  totalSupportedAssetsValue,
  unsupportedAssets,
}: AssetSectionOverviewProps) => {
  if (!supportedAssets.length && !unsupportedAssets.length)
    return (
      <Text variant="body1" color="text.dark">
        This {isAccount ? "address" : "contract"} does not hold any assets
      </Text>
    );

  return (
    <Grid gridGap={12} gridTemplateColumns={{ base: "1fr", xl: "1fr 1fr" }}>
      <GridItem>
        <Flex h="full" direction="column" justifyContent="space-between">
          <Flex direction="column">
            <SupportedAssetTitle
              supportedAssets={supportedAssets}
              totalSupportedAssetsValue={totalSupportedAssetsValue}
            />
            <Divider borderColor="gray.700" />
            <SupportedAssetSectionContent
              isAccount={isAccount}
              onViewMore={onViewMore}
              supportedAssets={supportedAssets.slice(
                0,
                MAX_SUPPORTED_ASSETS_SHOW
              )}
            />
          </Flex>
          {onViewMore && supportedAssets.length > MAX_SUPPORTED_ASSETS_SHOW && (
            <ViewMore minH="48px" borderRadius="8px" onClick={onViewMore} />
          )}
        </Flex>
      </GridItem>
      <GridItem>
        <UnsupportedAssetTitle unsupportedAssets={unsupportedAssets} />
        <Divider borderColor="gray.700" />
        <UnsupportedAssetSectionContent
          isAccount={isAccount}
          onViewMore={onViewMore}
          unsupportedAssets={unsupportedAssets.slice(
            0,
            MAX_UNSUPPORTED_ASSETS_SHOW
          )}
        />
        {onViewMore &&
          unsupportedAssets.length > MAX_UNSUPPORTED_ASSETS_SHOW && (
            <ViewMore minH="48px" borderRadius="8px" onClick={onViewMore} />
          )}
      </GridItem>
    </Grid>
  );
};

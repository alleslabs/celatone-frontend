import type { Option, TokenWithValue, USD } from "lib/types";

import { Divider, Flex, Grid, GridItem, Text } from "@chakra-ui/react";

import { ViewMore } from "../table";
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
      <Text color="text.dark" variant="body1">
        This {isAccount ? "address" : "contract"} does not hold any assets
      </Text>
    );

  return (
    <Grid gridGap={12} gridTemplateColumns={{ base: "1fr", xl: "1fr 1fr" }}>
      <GridItem>
        <Flex direction="column" h="full" justifyContent="space-between">
          <Flex direction="column">
            <SupportedAssetTitle
              supportedAssets={supportedAssets}
              totalSupportedAssetsValue={totalSupportedAssetsValue}
            />
            <Divider borderColor="gray.700" />
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
            <ViewMore borderRadius="8px" minH="48px" onClick={onViewMore} />
          )}
        </Flex>
      </GridItem>
      <GridItem>
        <UnsupportedAssetTitle unsupportedAssets={unsupportedAssets} />
        <Divider borderColor="gray.700" />
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
            <ViewMore borderRadius="8px" minH="48px" onClick={onViewMore} />
          )}
      </GridItem>
    </Grid>
  );
};

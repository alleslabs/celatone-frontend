import { Flex, Grid, Text } from "@chakra-ui/react";

import { UnsupportedToken } from "../token";
import type { TokenWithValue } from "lib/types";

interface UnsupportedAssetSectionContentProps {
  unsupportedAssets: TokenWithValue[];
  isAccount?: boolean;
  onViewMore?: () => void;
}

export const UnsupportedAssetSectionContent = ({
  unsupportedAssets,
  onViewMore,
  isAccount = false,
}: UnsupportedAssetSectionContentProps) => {
  if (!unsupportedAssets.length)
    return (
      <Flex
        w="full"
        alignItems="center"
        justifyContent={{ base: "flex-start", md: "center" }}
        h="calc(100% - 45px)"
        minH={20}
        px={4}
      >
        <Text variant="body2" color="text.dark">
          This {isAccount ? "address" : "contract"} does not hold any
          unsupported assets
        </Text>
      </Flex>
    );

  return (
    <Flex direction="column" gap={5} p={4}>
      <Grid
        gridGap={4}
        gridTemplateColumns={{
          base: "1 fr",
          md: onViewMore ? "1fr" : "repeat(2, 1fr)",
        }}
      >
        {unsupportedAssets.map((asset) => (
          <UnsupportedToken key={asset.denom} token={asset} />
        ))}
      </Grid>
    </Flex>
  );
};

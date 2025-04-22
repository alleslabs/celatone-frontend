import type { TokenWithValue } from "lib/types";

import { Flex, Grid, Text } from "@chakra-ui/react";

import { UnsupportedToken } from "../token";

interface UnsupportedAssetSectionContentProps {
  isAccount?: boolean;
  onViewMore?: () => void;
  unsupportedAssets: TokenWithValue[];
}

export const UnsupportedAssetSectionContent = ({
  isAccount = false,
  onViewMore,
  unsupportedAssets,
}: UnsupportedAssetSectionContentProps) => {
  if (!unsupportedAssets.length)
    return (
      <Flex
        alignItems="center"
        h="calc(100% - 45px)"
        justifyContent={{ base: "flex-start", md: "center" }}
        minH={20}
        w="full"
      >
        <Text color="text.dark" variant="body2">
          This {isAccount ? "address" : "contract"} does not hold any
          unsupported assets
        </Text>
      </Flex>
    );

  return (
    <Flex direction="column" gap={5} py={4}>
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

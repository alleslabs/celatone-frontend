import type { TokenWithValue } from "lib/types";

import { Flex } from "@chakra-ui/react";

import { TableTitle } from "../table";

interface UnsupportedAssetTitleProps {
  unsupportedAssets: TokenWithValue[];
}

export const UnsupportedAssetTitle = ({
  unsupportedAssets,
}: UnsupportedAssetTitleProps) => (
  <Flex py={1} w="full">
    <TableTitle
      title="Unsupported assets"
      count={unsupportedAssets.length}
      isSmall
      mb={0}
      title="Unsupported Assets"
    />
  </Flex>
);

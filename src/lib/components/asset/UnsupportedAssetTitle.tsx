import { Flex } from "@chakra-ui/react";

import type { TokenWithValue } from "lib/types";
import { TableTitle } from "../table";

interface UnsupportedAssetTitleProps {
  unsupportedAssets: TokenWithValue[];
}

export const UnsupportedAssetTitle = ({
  unsupportedAssets,
}: UnsupportedAssetTitleProps) => (
  <Flex w="full" py={1}>
    <TableTitle
      title="Unsupported assets"
      count={unsupportedAssets.length}
      mb={0}
      isSmall
    />
  </Flex>
);

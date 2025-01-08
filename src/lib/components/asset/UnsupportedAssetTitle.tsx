import { Flex } from "@chakra-ui/react";

import { TableTitle } from "../table";
import type { TokenWithValue } from "lib/types";

interface UnsupportedAssetTitleProps {
  unsupportedAssets: TokenWithValue[];
}

export const UnsupportedAssetTitle = ({
  unsupportedAssets,
}: UnsupportedAssetTitleProps) => (
  <Flex py={1} w="full">
    <TableTitle
      isSmall
      mb={0}
      title="Unsupported Assets"
      count={unsupportedAssets.length}
    />
  </Flex>
);

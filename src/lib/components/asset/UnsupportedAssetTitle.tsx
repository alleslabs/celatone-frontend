import { Flex } from "@chakra-ui/react";

import { TableTitle } from "../table";
import type { TokenWithValue } from "lib/types";

interface UnsupportedAssetTitleProps {
  unsupportedAssets: TokenWithValue[];
}

export const UnsupportedAssetTitle = ({
  unsupportedAssets,
}: UnsupportedAssetTitleProps) => (
  <Flex w="full" py={1}>
    <TableTitle
      title="Unsupported Assets"
      count={unsupportedAssets.length}
      mb={0}
      isSmall
    />
  </Flex>
);

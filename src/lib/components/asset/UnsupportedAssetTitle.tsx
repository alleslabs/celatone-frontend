import { Flex } from "@chakra-ui/react";

import { TableTitle } from "../table";
import type { TokenWithValue } from "lib/types";

interface UnsupportedAssetTitleProps {
  unsupportedAssets: TokenWithValue[];
}

export const UnsupportedAssetTitle = ({
  unsupportedAssets,
}: UnsupportedAssetTitleProps) => (
  <Flex w="full" bg="gray.900" py={2} px={4} borderRadius="8px 8px 0px 0px">
    <TableTitle
      title="Unsupported Assets"
      count={unsupportedAssets.length}
      mb={0}
      isSmall
    />
  </Flex>
);

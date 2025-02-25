import { Flex, Heading } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import type { Option, TokenWithValue, USD } from "lib/types";
import { formatPrice } from "lib/utils";
import { TableTitle } from "../table";

interface SupportedAssetTitleProps {
  supportedAssets: TokenWithValue[];
  totalSupportedAssetsValue: Option<USD<Big>>;
}

export const SupportedAssetTitle = ({
  supportedAssets,
  totalSupportedAssetsValue,
}: SupportedAssetTitleProps) => {
  const isMobile = useMobile();
  const isZeroValue =
    !totalSupportedAssetsValue || totalSupportedAssetsValue.eq(0);

  return (
    <Flex w="full" py={1} gap={2} align="center" justifyContent="space-between">
      <TableTitle
        title="Supported Assets"
        count={supportedAssets.length}
        mb={0}
        isSmall
      />
      {!isMobile && (
        <Heading
          mt={1}
          as="h6"
          variant="h7"
          color={isZeroValue ? "text.dark" : "text.main"}
        >
          {totalSupportedAssetsValue
            ? formatPrice(totalSupportedAssetsValue)
            : "N/A"}
        </Heading>
      )}
    </Flex>
  );
};

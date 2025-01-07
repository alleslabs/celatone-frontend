import { Flex, Heading } from "@chakra-ui/react";

import { TableTitle } from "../table";
import { useMobile } from "lib/app-provider";
import type { Option, TokenWithValue, USD } from "lib/types";
import { formatPrice } from "lib/utils";

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
    <Flex align="center" gap={2} py={1} w="full" justifyContent="space-between">
      <TableTitle
        isSmall
        mb={0}
        title="Supported Assets"
        count={supportedAssets.length}
      />
      {!isMobile && (
        <Heading
          as="h6"
          mt={1}
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

import type { Option, TokenWithValue, USD } from "lib/types";

import { Flex, Heading } from "@chakra-ui/react";
import { useMobile } from "lib/app-provider";
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
    <Flex align="center" gap={2} justifyContent="space-between" py={1} w="full">
      <TableTitle
        count={supportedAssets.length}
        isSmall
        mb={0}
        title="Supported assets"
      />
      {!isMobile && (
        <Heading
          as="h6"
          color={isZeroValue ? "text.dark" : "text.main"}
          mt={1}
          variant="h7"
        >
          {totalSupportedAssetsValue
            ? formatPrice(totalSupportedAssetsValue)
            : "N/A"}
        </Heading>
      )}
    </Flex>
  );
};

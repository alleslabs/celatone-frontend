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
    <Flex
      w="full"
      bg="gray.900"
      py={2}
      px={4}
      borderRadius="8px 8px 0px 0px"
      justifyContent="space-between"
    >
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
          variant="h6"
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

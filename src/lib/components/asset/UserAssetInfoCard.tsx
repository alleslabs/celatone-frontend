import type Big from "big.js";
import type { Option, USD } from "lib/types";

import { Flex, Heading, Text } from "@chakra-ui/react";
import { formatPrice } from "lib/utils";

interface UserAssetInfoCardProps {
  helperText?: string;
  totalSupportedAssetsValue: Option<USD<Big>>;
}

export const UserAssetInfoCard = ({
  helperText,
  totalSupportedAssetsValue,
}: UserAssetInfoCardProps) => {
  const isZeroValue =
    !totalSupportedAssetsValue || totalSupportedAssetsValue.eq(0);

  return (
    <Flex direction="column" width="fit-content">
      <Text color="text.dark" fontWeight={500} variant="body2">
        {helperText}
      </Text>
      <Heading
        as="h6"
        color={isZeroValue ? "text.dark" : "text.main"}
        mt={1}
        variant="h6"
      >
        {totalSupportedAssetsValue
          ? formatPrice(totalSupportedAssetsValue)
          : "N/A"}
      </Heading>
    </Flex>
  );
};

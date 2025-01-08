import { Flex, Heading, Text } from "@chakra-ui/react";
import type Big from "big.js";

import type { Option, USD } from "lib/types";
import { formatPrice } from "lib/utils";

interface UserAssetInfoCardProps {
  totalSupportedAssetsValue: Option<USD<Big>>;
  helperText?: string;
}

export const UserAssetInfoCard = ({
  totalSupportedAssetsValue,
  helperText,
}: UserAssetInfoCardProps) => {
  const isZeroValue =
    !totalSupportedAssetsValue || totalSupportedAssetsValue.eq(0);

  return (
    <Flex direction="column" width="fit-content">
      <Text variant="body2" fontWeight={500} color="text.dark">
        {helperText}
      </Text>
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
    </Flex>
  );
};

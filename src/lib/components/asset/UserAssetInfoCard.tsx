import { Flex, Heading, Text } from "@chakra-ui/react";
import type Big from "big.js";

import type { Option, USD } from "lib/types";
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
    <Flex width="fit-content" direction="column">
      <Text variant="body2" color="text.dark" fontWeight={500}>
        {helperText}
      </Text>
      <Heading
        as="h6"
        mt={1}
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

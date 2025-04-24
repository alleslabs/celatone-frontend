import type { BechAddr } from "lib/types";

import { Flex, Heading, Skeleton, Text } from "@chakra-ui/react";
import { useAccountTotalValue } from "lib/model/account";
import { formatPrice } from "lib/utils";

interface TotalValueProps {
  address: BechAddr;
  isCompact?: boolean;
  label?: string;
}
export const TotalValue = ({
  address,
  isCompact = false,
  label = "Total account value",
}: TotalValueProps) => {
  const { isLoading, totalAccountValue } = useAccountTotalValue(address);
  return (
    <Flex
      border="1px solid"
      borderColor="gray.700"
      borderRadius={8}
      direction="column"
      minW="200px"
      p={isCompact ? 3 : 4}
    >
      <Text color="text.dark" fontWeight={500} variant="body2">
        {label}
      </Text>
      {isLoading ? (
        <Skeleton
          borderRadius={2}
          endColor="gray.700"
          h={5}
          mt={1}
          startColor="gray.500"
        />
      ) : (
        <Heading
          as="h5"
          color={
            !totalAccountValue || totalAccountValue.eq(0)
              ? "text.disabled"
              : "text.main"
          }
          variant="h5"
        >
          {totalAccountValue ? formatPrice(totalAccountValue) : "N/A"}
        </Heading>
      )}
    </Flex>
  );
};

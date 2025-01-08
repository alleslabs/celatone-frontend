import { Flex, Heading, Skeleton, Text } from "@chakra-ui/react";

import { useAccountTotalValue } from "lib/model/account";
import type { BechAddr } from "lib/types";
import { formatPrice } from "lib/utils";

interface TotalValueProps {
  address: BechAddr;
  label?: string;
  isCompact?: boolean;
}
export const TotalValue = ({
  address,
  label = "Total Account Value",
  isCompact = false,
}: TotalValueProps) => {
  const { totalAccountValue, isLoading } = useAccountTotalValue(address);
  return (
    <Flex
      p={isCompact ? 3 : 4}
      direction="column"
      border="1px solid"
      borderColor="gray.700"
      borderRadius={8}
      minW="200px"
    >
      <Text variant="body2" fontWeight={500} color="text.dark">
        {label}
      </Text>
      {isLoading ? (
        <Skeleton
          mt={1}
          h={5}
          borderRadius={2}
          startColor="gray.500"
          endColor="gray.700"
        />
      ) : (
        <Heading
          as="h5"
          variant="h5"
          color={
            !totalAccountValue || totalAccountValue.eq(0)
              ? "text.disabled"
              : "text.main"
          }
        >
          {totalAccountValue ? formatPrice(totalAccountValue) : "N/A"}
        </Heading>
      )}
    </Flex>
  );
};

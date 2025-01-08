import { Flex, Heading, Skeleton, Text } from "@chakra-ui/react";

import { useAccountTotalValue } from "lib/model/account";
import type { BechAddr } from "lib/types";
import { formatPrice } from "lib/utils";

interface TotalValueProps {
  address: BechAddr;
  isCompact?: boolean;
  label?: string;
}
export const TotalValue = ({
  address,
  isCompact = false,
  label = "Total Account Value",
}: TotalValueProps) => {
  const { isLoading, totalAccountValue } = useAccountTotalValue(address);
  return (
    <Flex
      minW="200px"
      p={isCompact ? 3 : 4}
      border="1px solid"
      borderColor="gray.700"
      borderRadius={8}
      direction="column"
    >
      <Text variant="body2" color="text.dark" fontWeight={500}>
        {label}
      </Text>
      {isLoading ? (
        <Skeleton
          h={5}
          mt={1}
          borderRadius={2}
          endColor="gray.700"
          startColor="gray.500"
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

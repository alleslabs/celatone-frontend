import { Flex, Heading, Skeleton, Text } from "@chakra-ui/react";

import { useAccountTotalValue } from "../data";
import type { HumanAddr } from "lib/types";
import { formatPrice } from "lib/utils";

interface TotalAccountValueProps {
  accountAddress: HumanAddr;
}
export const TotalAccountValue = ({
  accountAddress,
}: TotalAccountValueProps) => {
  const { totalAccountValue, isLoading } = useAccountTotalValue(accountAddress);
  return (
    <Flex
      p={4}
      direction="column"
      border="2px solid"
      borderColor="gray.700"
      borderRadius={4}
    >
      <Text variant="body2" fontWeight={500} color="text.dark">
        Total Account Value
      </Text>
      {isLoading ? (
        <Skeleton
          mt={1}
          h={8}
          w="full"
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
              ? "text.dark"
              : "text.main"
          }
        >
          {totalAccountValue ? formatPrice(totalAccountValue) : "N/A"}
        </Heading>
      )}
    </Flex>
  );
};

import { Flex, Heading, Text } from "@chakra-ui/react";

import { useAccountTotalValue } from "../data";
import { Loading } from "lib/components/Loading";
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
      pt={{ base: 6, md: 8 }}
      pb={{ base: 2, md: 8 }}
      direction="column"
      borderBottom={{ base: "0px", md: "1px solid" }}
      borderBottomColor={{ base: "transparent", md: "gray.700" }}
    >
      <Text variant="body2" fontWeight={500} color="text.dark">
        Total Account Value
      </Text>
      {isLoading ? (
        <Loading />
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

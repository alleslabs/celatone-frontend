import { Flex, Text } from "@chakra-ui/react";

import { DotSeparator } from "lib/components/DotSeparator";

const StatWithLabel = ({ label, value }: { label: string; value: string }) => (
  <Flex gap={{ md: 1 }} direction={{ base: "column", md: "row" }}>
    <Text variant="body2" fontWeight={600} color="text.dark">
      {label}
    </Text>
    <Text variant="body2" fontWeight={600} color="text.main">
      {value}
    </Text>
  </Flex>
);

export const ValidatorStats = () => (
  <Flex
    alignItems="center"
    justifyContent={{ base: "space-between", md: "start" }}
    gap={{ base: 3, md: 2 }}
    mt={{ base: 2, md: 1 }}
    mb={{ base: 0, md: 1 }}
    px={{ base: 3, md: 0 }}
    py={{ base: 1, md: 0 }}
    border={{ base: "1px solid", md: "0px" }}
    borderColor="gray.700"
    borderRadius={4}
  >
    <StatWithLabel label="Commission" value="5.00%" />
    <DotSeparator bg="gray.600" display={{ base: "none", md: "flex" }} />
    <StatWithLabel label="Estimated APR" value="6.21%" />{" "}
    <DotSeparator bg="gray.600" display={{ base: "none", md: "flex" }} />
    <StatWithLabel label="Delegators" value="253" />
  </Flex>
);

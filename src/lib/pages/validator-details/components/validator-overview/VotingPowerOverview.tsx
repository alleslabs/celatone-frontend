import { Flex, Heading, Text } from "@chakra-ui/react";

import { ValueWithIcon } from "lib/components/ValueWithIcon";

// TODO remove mockup data

const VotingPowerDetail = ({
  label,
  percent,
  amount,
  denom,
  value,
}: {
  label: string;
  percent: string;
  amount: string;
  denom: string;
  value: string;
}) => (
  <Flex direction="column" w="full">
    <Text variant="body2" color="text.dark" mb={2}>
      {label}
    </Text>
    <Text fontWeight={700} variant="body1">
      {percent}
    </Text>
    <Text fontWeight={700} variant="body2">
      {amount}{" "}
      <span
        style={{
          fontWeight: "400",
        }}
      >
        {denom}
      </span>
    </Text>
    <Text variant="body3" color="text.dark">
      ({value})
    </Text>
  </Flex>
);

export const VotingPowerOverview = () => {
  return (
    <Flex
      direction="column"
      gap={4}
      backgroundColor="gray.900"
      p={{ base: 4, md: 6 }}
      rounded={8}
      w="100%"
    >
      <Flex direction="column" gap={1}>
        <Flex minH="36px" alignItems="center">
          <Heading variant="h6" as="h6" color="text.main">
            Voting Power
          </Heading>
        </Flex>
        <ValueWithIcon icon="vote" value="7.21%" />
        <Flex gap={2} alignItems="center" mt={1}>
          <Flex direction="column">
            <Text fontWeight={700} variant="body1">
              123,456,789.0{" "}
              <span
                style={{
                  fontWeight: "400",
                }}
              >
                OSMO
              </span>
            </Text>
            <Text variant="body2" color="text.dark">
              ($12.00)
            </Text>
          </Flex>
          {/* TODO: add TokenImageRender here */}
        </Flex>
      </Flex>
      <Flex
        borderTop="1px solid"
        borderTopColor="gray.700"
        pt={4}
        display={{ base: "none", md: "flex" }}
      >
        <VotingPowerDetail
          label="Self-Bonded"
          percent="80.00%"
          amount="123,456,789.00"
          denom="OSMO"
          value="$12.00"
        />
        <VotingPowerDetail
          label="From Delegators"
          percent="20.00%"
          amount="123,456,789.00"
          denom="OSMO"
          value="$12.00"
        />
      </Flex>
    </Flex>
  );
};

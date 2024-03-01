import { Flex, Text } from "@chakra-ui/react";

const LegendItem = ({
  label,
  color,
  value,
  percent,
}: {
  label: string;
  color: string;
  value: string;
  percent: string;
}) => (
  <Flex gap={2} w="full">
    <Flex w={3} h={3} borderRadius="2px" backgroundColor={color} mt={1} />
    <Flex
      direction={{ base: "row", md: "column" }}
      alignItems={{ base: "end", md: "start" }}
    >
      <Text
        variant="body2"
        fontWeight={700}
        color="text.dark"
        w={{ base: 40, md: "auto" }}
      >
        {label}
      </Text>
      <Text
        variant={{ base: "body2", md: "body1" }}
        fontWeight={700}
        color="text.main"
        w={{ base: 12, md: "auto" }}
      >
        {value}
      </Text>
      <Text variant="body3" color="text.dark">
        {percent}
      </Text>
    </Flex>
  </Flex>
);
export const RecentBlocksLegends = () => {
  return (
    <Flex direction={{ base: "column", md: "row" }}>
      <LegendItem
        label="Signed Blocks"
        color="primary.main"
        value="88"
        percent="95.21%"
      />
      <LegendItem
        label="Proposed Blocks"
        color="secondary.main"
        value="12"
        percent="3.00%"
      />
      <LegendItem
        label="Proposed Blocks"
        color="error.dark"
        value="3"
        percent="1.11%"
      />
    </Flex>
  );
};

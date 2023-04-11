import { Box, Flex, Heading, Text, Tooltip } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";

const cardProps = {
  width: "100%",
  padding: "16px",
  borderRadius: "8px",
  justifyContent: "space-between",
  alignItems: "center",
  height: "100%",
  cursor: "pointer",
};

const cardInfo = [
  {
    title: "Total Transactions",
    tooltip:
      "Verified transactions track network activity and growth, indicating ecosystem health.",
    value: "1,111,111",
  },
  {
    title: "Latest Block Height",
    tooltip:
      "Latest Block Height tracks transactions and network growth for a healthy blockchain ecosystem.",
    value: "12345678",
  },
];
export const NetworkOverview = () => (
  <Flex direction="column" gap={4} p="48px">
    <Flex justifyContent="space-between">
      <Heading as="h4" variant="h4">
        Network Overview
      </Heading>
      <Text variant="body2" color="text.dark" textAlign="right">
        Updated 3 seconds ago <br />
        Oct 24, 2022, 7:58:34 PM (GMT+7)
      </Text>
    </Flex>
    <Flex gap={4}>
      {cardInfo.map((item) => (
        <Flex
          style={cardProps}
          _hover={{ bg: "pebble.700" }}
          transition="all .25s ease-in-out"
          bg="pebble.800"
        >
          <Box>
            <Flex alignItems="center" gap={1}>
              <Text variant="body2" color="text.dark">
                {item.title}
              </Text>
              <Tooltip
                hasArrow
                label={item.tooltip}
                placement="top"
                bg="honeydew.darker"
                arrowSize={8}
              >
                <Flex cursor="pointer">
                  <CustomIcon name="info-circle-solid" boxSize="3" />
                </Flex>
              </Tooltip>
            </Flex>
            <Heading as="h5" variant="h5">
              {item.value}
            </Heading>
          </Box>
          <CustomIcon name="chevron-right" boxSize={5} />
        </Flex>
      ))}
    </Flex>
  </Flex>
);

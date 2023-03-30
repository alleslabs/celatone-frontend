import {
  Badge,
  Button,
  Flex,
  Heading,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";

import { CustomIcon } from "lib/components/icon";
import { ToggleWithName } from "lib/components/ToggleWithName";

import { PoolCard } from "./PoolCard";

export const PoolList = () => {
  const [showNewest, setShowNewest] = useState(true);
  const [toggle, setToggle] = useState("percent-value");
  const options = [
    {
      label: "%Value",
      value: "percent-value",
    },
    {
      label: "Amount",
      value: "amount",
    },
  ];
  return (
    <>
      <Flex alignItems="center" justifyContent="space-between">
        <Flex gap={2} h="29px" alignItems="center">
          <Heading as="h6" variant="h6">
            Pools
          </Heading>
          <Badge variant="gray" color="text.main" textColor="text.main">
            12
          </Badge>
        </Flex>
        <Flex gap={4}>
          <Flex gap="2" alignItems="center">
            <Text variant="body2" color="text.dark">
              Sort Pool ID:
            </Text>
            {showNewest ? (
              <Button
                variant="outline-gray"
                size="sm"
                pr="1"
                onClick={() => setShowNewest(!showNewest)}
              >
                Newest First
                <CustomIcon name="arrow-down" color="text.dark" />
              </Button>
            ) : (
              <Button
                variant="outline-gray"
                size="sm"
                pr="1"
                onClick={() => setShowNewest(!showNewest)}
              >
                Oldest First
                <CustomIcon name="arrow-up" color="text.dark" />
              </Button>
            )}
          </Flex>
          <Flex gap="2" alignItems="center">
            <Text variant="body2" color="text.dark">
              View asset allocation in:
            </Text>
            <ToggleWithName
              selectedValue={toggle}
              options={options}
              selectOption={(value: string) => setToggle(value)}
            />
          </Flex>
        </Flex>
      </Flex>
      <SimpleGrid columns={{ sm: 1, md: 2 }} spacing={4} w="full">
        <PoolCard /> <PoolCard /> <PoolCard /> <PoolCard />
      </SimpleGrid>
    </>
  );
};

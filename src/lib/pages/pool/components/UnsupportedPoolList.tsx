import {
  Accordion,
  Badge,
  Button,
  Flex,
  Heading,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";

import { CustomIcon } from "lib/components/icon";
import type { PoolDetail } from "lib/types/pool";

import { UnsupportedPoolCard } from "./UnsupportedPoolCard";

interface UnsupportedPoolListProp {
  pools: PoolDetail[];
}
export const UnsupportedPoolList = ({ pools }: UnsupportedPoolListProp) => {
  const [showNewest, setShowNewest] = useState(true);
  return (
    <>
      <Flex alignItems="center" justifyContent="space-between" h="32px">
        <Flex gap={2} alignItems="center">
          <Heading as="h6" variant="h6">
            Pools with unsupported tokens
          </Heading>
          <Badge variant="gray" color="text.main" textColor="text.main">
            {pools.length}
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
            <Button variant="outline-gray" size="sm">
              Expand All
            </Button>
          </Flex>
        </Flex>
      </Flex>
      <SimpleGrid columns={1} spacing={4} w="full">
        <Accordion allowMultiple>
          {pools.map((item) => (
            <UnsupportedPoolCard
              key={item.pool_id}
              item={item}
              poolId={item.pool_id}
            />
          ))}
        </Accordion>
      </SimpleGrid>
    </>
  );
};

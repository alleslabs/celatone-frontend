import type { FlexProps } from "@chakra-ui/react";
import { Text, Flex, Badge, Skeleton, Button, Heading } from "@chakra-ui/react";

import { CountBadge } from "lib/components/module/CountBadge";
import { FunctionCard } from "lib/components/module/FunctionCard";
import { ModuleCard } from "lib/components/module/ModuleCard";
// import { ModuleEmptyState } from "./ModuleEmptyState";

const functionSelectBaseStyle: FlexProps = {
  border: "1px solid",
  borderRadius: 8,
  borderColor: "gray.700",
  p: 4,
  direction: "column",
};

export const ModuleSelectBody = () => {
  return (
    <>
      <Flex borderRadius={8} columnGap={4}>
        {/* Left */}
        <Flex direction="column" flex={0.2}>
          <Flex bg="teal.300" mb={6}>
            input here
          </Flex>
          <Flex direction="column" gap={2}>
            <Flex alignItems="center" gap={2}>
              <Text variant="body2" fontWeight={600} color="text.dark">
                Modules
              </Text>
              <Badge variant="gray" textColor="text.main">
                <s>0</s>
              </Badge>
            </Flex>
            <Skeleton
              h={9}
              borderRadius={8}
              startColor="gray.500"
              endColor="gray.700"
            />
            <ModuleCard />
          </Flex>
        </Flex>
        {/* Right */}
        {/* <Flex flex={4}>
          <ModuleEmptyState
            description="Choose a module to see its functions."
            imageWidth="80px"
          />
        </Flex> */}
        <Flex flex={0.8} gap={4} {...functionSelectBaseStyle}>
          <Heading as="h6" variant="h6" fontWeight={600}>
            Module name goes here
          </Heading>
          <Flex bg="teal.300">input here</Flex>
          <Flex gap={6}>
            <Flex flex={0.5} gap={3} {...functionSelectBaseStyle}>
              <Flex alignItems="center" gap={1}>
                <Text variant="body2" fontWeight={600} color="text.dark">
                  View Functions
                </Text>
                <CountBadge count={0} variant="view" />
              </Flex>
              <FunctionCard />
              <FunctionCard disabled visibility="friends" />
              <FunctionCard disabled visibility="script" />
            </Flex>
            <Flex flex={0.5} gap={3} {...functionSelectBaseStyle}>
              <Flex alignItems="center" gap={1}>
                <Text variant="body2" fontWeight={600} color="text.dark">
                  Execute Functions
                </Text>
                <CountBadge count={0} variant="execute" />
              </Flex>
              <FunctionCard isView={false} />
              <FunctionCard isView={false} disabled visibility="friends" />
              <FunctionCard isView={false} disabled visibility="script" />
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <Button mt={6} ml="auto">
        Select this module
      </Button>
    </>
  );
};

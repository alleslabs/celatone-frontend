import {
  Text,
  Flex,
  Badge,
  Skeleton,
  Box,
  Button,
  Heading,
} from "@chakra-ui/react";

import { FunctionCard } from "lib/components/module/FunctionCard";
import { ModuleCard } from "lib/components/module/ModuleCard";
// import { ModuleEmptyState } from "./ModuleEmptyState";

export const ModuleSelectBody = () => {
  return (
    <Box>
      <Flex borderRadius={8} gap={4}>
        {/* Left */}
        <Flex flex={1} flexDirection="column" gap={6}>
          <Flex bg="teal.300">input here</Flex>
          <Flex flexDirection="column" gap={2}>
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
        <Flex
          flex={4}
          border="1px solid"
          borderRadius={8}
          borderColor="gray.700"
          p={4}
          flexDirection="column"
          gap={4}
        >
          <Heading as="h6" variant="h6" fontWeight={600}>
            Module name goes here
          </Heading>
          <Flex bg="teal.300">input here</Flex>
          <Flex gap={6}>
            <Flex
              w="full"
              border="1px solid"
              borderRadius={8}
              borderColor="gray.700"
              p={4}
              flexDirection="column"
              gap={3}
            >
              <Flex alignItems="center" gap={1}>
                <Text variant="body2" fontWeight={600} color="text.dark">
                  View Functions
                </Text>
                <Badge
                  bgColor="transparent"
                  border="1px solid"
                  borderColor="primary.main"
                  textColor="text.main"
                >
                  <s>0</s>
                </Badge>
              </Flex>
              <FunctionCard />
              <FunctionCard disabled visibility="friends" />
              <FunctionCard disabled visibility="script" />
            </Flex>
            <Flex
              w="full"
              border="1px solid"
              borderRadius={8}
              borderColor="gray.700"
              p={4}
              flexDirection="column"
              gap={3}
            >
              <Flex alignItems="center" gap={1}>
                <Text variant="body2" fontWeight={600} color="text.dark">
                  Execute Functions
                </Text>
                <Badge
                  bgColor="transparent"
                  border="1px solid"
                  borderColor="accent.dark"
                  textColor="text.main"
                >
                  <s>0</s>
                </Badge>
              </Flex>
              <FunctionCard isView={false} />
              <FunctionCard isView={false} disabled visibility="friends" />
              <FunctionCard isView={false} disabled visibility="script" />
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <Flex justifyContent="flex-end" mt={6}>
        <Button>Select this module</Button>
      </Flex>
    </Box>
  );
};

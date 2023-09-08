import { Button, ButtonGroup, Flex, Heading } from "@chakra-ui/react";

import { StateCard } from "./StateCard";
import { StateLoader } from "./StateLoader";

const namespaces = [
  "test1",
  "test2",
  "test3",
  "test4",
  "test5",
  "test6",
  "test7",
  "test8",
  "test9",
  "test10",
  "test11",
  "test12",
  "test13",
  "test14",
  "test15",
  "test16",
  "test17",
  "test18",
  "test19",
  "test20",
];
export const ContractStates = () => {
  return (
    <Flex direction="column" gap={8}>
      <Flex direction="column" gap={6}>
        <Heading as="h6" variant="h6">
          Contract States
        </Heading>
        <StateLoader isLoading isCompleted={false} />
        <StateLoader isLoading={false} isCompleted={false} />
        <StateLoader isLoading={false} isCompleted />
      </Flex>
      {/* Namespace filter */}
      <ButtonGroup
        flexWrap="wrap"
        rowGap={2}
        sx={{
          "> button": {
            marginInlineStart: "0 !important",
            marginInlineEnd: "1",
          },
        }}
      >
        {namespaces.map((item) => (
          <Button
            variant="command-button"
            fontSize="14px"
            height="28px"
            borderRadius="16px"
            fontWeight={400}
          >
            {item}
          </Button>
        ))}
      </ButtonGroup>
      {/* Searchbar */}
      search in put here
      {/* States */}
      <Flex direction="column" gap={4}>
        <StateCard /> <StateCard /> <StateCard /> <StateCard />
      </Flex>
    </Flex>
  );
};

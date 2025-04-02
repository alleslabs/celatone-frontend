import { Button, Flex, Spinner } from "@chakra-ui/react";

import { CustomIcon } from "./icon";

interface LoadNextProps {
  text: string;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
}

export const LoadNext = ({
  text,
  fetchNextPage,
  isFetchingNextPage,
}: LoadNextProps) => (
  <Flex align="center" h="64px" justifyContent="center" w="full">
    {isFetchingNextPage ? (
      <Spinner />
    ) : (
      <Button
        gap={2}
        h="full"
        variant="ghost-gray"
        w="full"
        onClick={fetchNextPage}
      >
        {text}
        <CustomIcon boxSize="12px" name="chevron-down" />
      </Button>
    )}
  </Flex>
);

import { Button, Flex, Spinner } from "@chakra-ui/react";

import { CustomIcon } from "./icon";

interface LoadNextProps {
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  text: string;
}

export const LoadNext = ({
  fetchNextPage,
  isFetchingNextPage,
  text,
}: LoadNextProps) => (
  <Flex align="center" h="64px" w="full" justifyContent="center">
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
        <CustomIcon name="chevron-down" boxSize="12px" />
      </Button>
    )}
  </Flex>
);

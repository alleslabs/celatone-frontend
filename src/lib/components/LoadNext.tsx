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
  <Flex w="full" justifyContent="center" align="center" h="64px">
    {isFetchingNextPage ? (
      <Spinner />
    ) : (
      <Button
        w="full"
        h="full"
        variant="ghost-gray"
        gap={2}
        onClick={fetchNextPage}
      >
        {text}
        <CustomIcon name="chevron-down" boxSize="12px" />
      </Button>
    )}
  </Flex>
);

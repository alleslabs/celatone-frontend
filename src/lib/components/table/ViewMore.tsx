import { Button, Flex } from "@chakra-ui/react";

import { CustomIcon } from "../icon";

interface ViewMoreProps {
  onClick: () => void;
}

export const ViewMore = ({ onClick }: ViewMoreProps) => (
  <Flex w="full" justifyContent="center" textAlign="center">
    <Button
      size="sm"
      variant="ghost"
      color="text.dark"
      rightIcon={<CustomIcon name="chevron-down" />}
      onClick={onClick}
    >
      View More
    </Button>
  </Flex>
);

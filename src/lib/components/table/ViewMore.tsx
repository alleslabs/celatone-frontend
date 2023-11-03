import { Button, Flex } from "@chakra-ui/react";

import { CustomIcon } from "../icon";
import { AmpEvent, track } from "lib/amplitude";

interface ViewMoreProps {
  onClick: () => void;
}

export const ViewMore = ({ onClick }: ViewMoreProps) => (
  <Flex w="full" justifyContent="center" textAlign="center">
    <Button
      w="full"
      borderRadius="0"
      minH="64px"
      variant="ghost-gray"
      gap={2}
      onClick={() => {
        track(AmpEvent.USE_VIEW_MORE);
        onClick();
      }}
    >
      View More
      <CustomIcon name="chevron-right" boxSize="12px" />
    </Button>
  </Flex>
);

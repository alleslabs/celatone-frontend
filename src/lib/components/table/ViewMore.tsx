import { Button, Flex } from "@chakra-ui/react";

import { CustomIcon } from "../icon";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";

interface ViewMoreProps {
  onClick: () => void;
}

export const ViewMore = ({ onClick }: ViewMoreProps) => (
  <Flex w="full" justifyContent="center" textAlign="center">
    <Button
      size="md"
      w="full"
      borderRadius="0"
      minH="64px"
      variant="ghost-gray"
      color="text.dark"
      gap={2}
      onClick={() => {
        AmpTrack(AmpEvent.USE_VIEW_MORE);
        onClick();
      }}
    >
      View More
      <CustomIcon name="chevron-right" boxSize="12px" color="text.dark" />
    </Button>
  </Flex>
);

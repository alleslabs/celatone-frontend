import { Button, Flex } from "@chakra-ui/react";

import { CustomIcon } from "../icon";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";

interface ViewMoreProps {
  onClick: () => void;
}

export const ViewMore = ({ onClick }: ViewMoreProps) => (
  <Flex w="full" justifyContent="center" textAlign="center">
    <Button
      size="sm"
      variant="ghost"
      color="text.dark"
      pr={0}
      rightIcon={<CustomIcon name="chevron-right" boxSize="12px" />}
      onClick={() => {
        AmpTrack(AmpEvent.USE_VIEW_MORE);
        onClick();
      }}
    >
      View More
    </Button>
  </Flex>
);

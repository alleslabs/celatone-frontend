import type { BorderProps, LayoutProps } from "@chakra-ui/react";
import { Button, Flex } from "@chakra-ui/react";

import { CustomIcon } from "../icon";
import { AmpEvent, track } from "lib/amplitude";

interface ViewMoreProps {
  onClick: () => void;
  borderRadius?: BorderProps["borderRadius"];
  minH?: LayoutProps["minH"];
}

export const ViewMore = ({
  onClick,
  borderRadius = "0",
  minH = "64px",
}: ViewMoreProps) => (
  <Flex w="full" justifyContent="center" textAlign="center">
    <Button
      w="full"
      borderRadius={borderRadius}
      minH={minH}
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

import type { BorderProps, LayoutProps } from "@chakra-ui/react";
import { Button, Flex } from "@chakra-ui/react";

import { trackUseViewMore } from "lib/amplitude";
import { CustomIcon } from "../icon";

interface ViewMoreProps {
  onClick: () => void;
  borderRadius?: BorderProps["borderRadius"];
  minH?: LayoutProps["minH"];
  text?: string;
}

export const ViewMore = ({
  onClick,
  borderRadius = "0",
  minH = "64px",
  text = "View more",
}: ViewMoreProps) => (
  <Flex w="full" justifyContent="center" textAlign="center">
    <Button
      w="full"
      borderRadius={borderRadius}
      minH={minH}
      variant="ghost-gray"
      gap={2}
      onClick={() => {
        trackUseViewMore();
        onClick();
      }}
    >
      {text}
      <CustomIcon name="chevron-right" boxSize="12px" />
    </Button>
  </Flex>
);

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
  text = "View More",
}: ViewMoreProps) => (
  <Flex justifyContent="center" textAlign="center" w="full">
    <Button
      borderRadius={borderRadius}
      gap={2}
      minH={minH}
      variant="ghost-gray"
      w="full"
      onClick={() => {
        trackUseViewMore();
        onClick();
      }}
    >
      {text}
      <CustomIcon boxSize="12px" name="chevron-right" />
    </Button>
  </Flex>
);

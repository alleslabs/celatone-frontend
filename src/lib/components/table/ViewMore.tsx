import type { BorderProps, LayoutProps } from "@chakra-ui/react";

import { Button, Flex } from "@chakra-ui/react";
import { trackUseViewMore } from "lib/amplitude";

import { CustomIcon } from "../icon";

interface ViewMoreProps {
  borderRadius?: BorderProps["borderRadius"];
  minH?: LayoutProps["minH"];
  onClick: () => void;
  text?: string;
}

export const ViewMore = ({
  borderRadius = "0",
  minH = "64px",
  onClick,
  text = "View more",
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

import type { BorderProps, LayoutProps } from "@chakra-ui/react";
import { Button, Flex } from "@chakra-ui/react";

import { CustomIcon } from "../icon";
import { trackUseViewMore } from "lib/amplitude";

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
  text = "View More",
}: ViewMoreProps) => (
  <Flex textAlign="center" w="full" justifyContent="center">
    <Button
      gap={2}
      minH={minH}
      variant="ghost-gray"
      w="full"
      borderRadius={borderRadius}
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

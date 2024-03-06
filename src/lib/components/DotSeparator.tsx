import { Box } from "@chakra-ui/react";
import type { BoxProps } from "@chakra-ui/react";

export const DotSeparator = ({
  bg = "secondary.darker",
  ...props
}: BoxProps) => (
  <Box
    bg={bg}
    borderRadius="50%"
    w={1}
    h={1}
    maxW={1}
    minW={1}
    minH={1}
    maxH={1}
    {...props}
  />
);

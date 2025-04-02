import type { BoxProps } from "@chakra-ui/react";

import { Box } from "@chakra-ui/react";

export const DotSeparator = ({ bg = "primary.darker", ...props }: BoxProps) => (
  <Box
    bg={bg}
    borderRadius="50%"
    h={1}
    maxH={1}
    maxW={1}
    minH={1}
    minW={1}
    w={1}
    {...props}
  />
);

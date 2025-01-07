import { Box } from "@chakra-ui/react";
import type { BoxProps } from "@chakra-ui/react";

export const DotSeparator = ({ bg = "primary.darker", ...props }: BoxProps) => (
  <Box
    bg={bg}
    h={1}
    maxH={1}
    maxW={1}
    minH={1}
    minW={1}
    w={1}
    borderRadius="50%"
    {...props}
  />
);

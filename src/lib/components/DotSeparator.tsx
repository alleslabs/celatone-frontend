import { Box, type BoxProps } from "@chakra-ui/react";

export const DotSeparator = (props: BoxProps) => (
  <Box
    bg="secondary.darker"
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

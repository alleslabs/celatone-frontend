import type { BoxProps } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";

const PageContainer = ({ children, ...containerProps }: BoxProps) => (
  <Box
    as="main"
    p={{ base: "16px", md: "48px" }}
    overflowX="hidden"
    minH="inherit"
    {...containerProps}
  >
    {children}
  </Box>
);

export default PageContainer;

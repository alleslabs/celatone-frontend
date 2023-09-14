import type { BoxProps } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface PageContainerProps extends BoxProps {
  children: ReactNode;
}

const PageContainer = ({ children, ...containerProps }: PageContainerProps) => (
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

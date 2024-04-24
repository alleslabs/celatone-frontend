import type { BoxProps } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";

interface PageContainerProps extends BoxProps {
  hasPaddingTop?: boolean;
}

const PageContainer = ({
  hasPaddingTop = true,
  children,
  ...containerProps
}: PageContainerProps) => (
  <Box
    as="main"
    pt={hasPaddingTop ? { base: "16px", md: "48px" } : 0}
    px={{ base: "16px", md: "48px" }}
    pb={{ base: "16px", md: "48px" }}
    overflowX="hidden"
    minH="inherit"
    {...containerProps}
  >
    {children}
  </Box>
);

export default PageContainer;

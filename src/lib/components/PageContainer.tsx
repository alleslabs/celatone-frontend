import { Box } from "@chakra-ui/react";
import type { ReactNode } from "react";

type PageContainerProps = {
  children: ReactNode;
};

const PageContainer = ({ children }: PageContainerProps) => (
  <Box as="main" p={12} overflowX="hidden" minH="inherit">
    {children}
  </Box>
);

export default PageContainer;

import { Box } from "@chakra-ui/react";
import type { ReactNode } from "react";

type PageContainerProps = {
  children: ReactNode;
};

const PageContainer = ({ children }: PageContainerProps) => (
  <Box
    as="main"
    p={{ base: "16px", md: "48px" }}
    overflowX="hidden"
    minH="inherit"
  >
    {children}
  </Box>
);

export default PageContainer;

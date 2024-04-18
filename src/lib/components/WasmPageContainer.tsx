import type { BoxProps } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import type { ReactNode } from "react";

type WasmPageContainerProps = {
  children: ReactNode;
  boxProps?: BoxProps;
};

const WasmPageContainer = ({ children, boxProps }: WasmPageContainerProps) => (
  <Box
    as="main"
    align="center"
    w={540}
    mx="auto"
    minH="inherit"
    py={12}
    {...boxProps}
  >
    {children}
  </Box>
);

export default WasmPageContainer;

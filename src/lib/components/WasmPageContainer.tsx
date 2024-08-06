import type { BoxProps } from "@chakra-ui/react";
import { Flex } from "@chakra-ui/react";
import type { ReactNode } from "react";

type WasmPageContainerProps = {
  children: ReactNode;
  boxProps?: BoxProps;
};

const WasmPageContainer = ({ children, boxProps }: WasmPageContainerProps) => (
  <Flex
    as="main"
    align="center"
    direction="column"
    w={572}
    mx="auto"
    minH="inherit"
    pt={12}
    pb={36}
    {...boxProps}
  >
    {children}
  </Flex>
);

export default WasmPageContainer;

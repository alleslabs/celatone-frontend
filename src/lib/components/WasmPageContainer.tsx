import type { FlexProps } from "@chakra-ui/react";
import { Flex } from "@chakra-ui/react";
import type { ReactNode } from "react";

type WasmPageContainerProps = {
  children: ReactNode;
  flexProps?: FlexProps;
};

const WasmPageContainer = ({ children, flexProps }: WasmPageContainerProps) => (
  <Flex
    as="main"
    align="center"
    w={540}
    mx="auto"
    direction="column"
    minH="inherit"
    py={12}
    {...flexProps}
  >
    {children}
  </Flex>
);

export default WasmPageContainer;

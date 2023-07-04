import { Flex } from "@chakra-ui/react";
import type { ReactNode } from "react";

type WasmPageContainerProps = {
  children: ReactNode;
  width?: string;
};

const WasmPageContainer = ({
  children,
  width = "540px",
}: WasmPageContainerProps) => (
  <Flex
    as="main"
    align="center"
    width={width}
    mx="auto"
    py={12}
    direction="column"
  >
    {children}
  </Flex>
);

export default WasmPageContainer;

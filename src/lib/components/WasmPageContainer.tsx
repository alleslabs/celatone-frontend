import { Flex } from "@chakra-ui/react";
import type { ReactNode } from "react";

type WasmPageContainerProps = {
  children: ReactNode;
};

const WasmPageContainer = ({ children }: WasmPageContainerProps) => {
  return (
    <Flex
      as="main"
      align="center"
      width="540px"
      mx="auto"
      my="90px"
      direction="column"
    >
      {children}
    </Flex>
  );
};

export default WasmPageContainer;

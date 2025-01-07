import type { BoxProps } from "@chakra-ui/react";
import { Flex } from "@chakra-ui/react";
import type { ReactNode } from "react";

type ActionPageContainerProps = {
  boxProps?: BoxProps;
  children: ReactNode;
  width?: number;
};

const ActionPageContainer = ({
  boxProps,
  children,
  width = 572,
}: ActionPageContainerProps) => (
  <Flex
    align="center"
    as="main"
    minH="inherit"
    mx="auto"
    pb={36}
    pt={12}
    w={width}
    direction="column"
    {...boxProps}
  >
    {children}
  </Flex>
);

export default ActionPageContainer;

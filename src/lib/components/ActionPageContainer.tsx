import type { BoxProps } from "@chakra-ui/react";
import { Flex } from "@chakra-ui/react";
import type { ReactNode } from "react";

type ActionPageContainerProps = {
  children: ReactNode;
  boxProps?: BoxProps;
  width?: number;
};

const ActionPageContainer = ({
  children,
  boxProps,
  width = 540,
}: ActionPageContainerProps) => (
  <Flex
    as="main"
    align="center"
    direction="column"
    w={width}
    mx="auto"
    minH="inherit"
    pt={12}
    pb={36}
    {...boxProps}
  >
    {children}
  </Flex>
);

export default ActionPageContainer;

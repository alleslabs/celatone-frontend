import type { BoxProps } from "@chakra-ui/react";
import type { ReactNode } from "react";

import { Flex } from "@chakra-ui/react";

type ActionPageContainerProps = {
  children: ReactNode;
  boxProps?: BoxProps;
  width?: number;
};

const ActionPageContainer = ({
  children,
  boxProps,
  width = 572,
}: ActionPageContainerProps) => (
  <Flex
    align="center"
    as="main"
    direction="column"
    minH="inherit"
    mx="auto"
    pb={36}
    pt={12}
    w={width}
    {...boxProps}
  >
    {children}
  </Flex>
);

export default ActionPageContainer;

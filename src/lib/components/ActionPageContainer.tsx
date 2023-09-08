import { Flex } from "@chakra-ui/react";
import type { ReactNode } from "react";

type ActionPageContainerProps = {
  children: ReactNode;
  width?: string;
};

const ActionPageContainer = ({
  children,
  width = "540px",
}: ActionPageContainerProps) => (
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

export default ActionPageContainer;

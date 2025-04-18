import type { BoxProps, FlexboxProps, FlexProps } from "@chakra-ui/react";
import type { ReactNode } from "react";

import { Flex } from "@chakra-ui/react";

interface SectionWrapperProps {
  children: ReactNode;
  minW?: FlexProps["minW"];
  w?: BoxProps["w"];
  justifyContent?: FlexboxProps["justifyContent"];
  borderRight?: boolean;
}

export const SectionWrapper = ({
  borderRight = true,
  children,
  justifyContent = "center",
  minW = "auto",
  w = "auto",
}: SectionWrapperProps) => (
  <Flex
    alignItems="center"
    borderColor="gray.700"
    borderRightWidth={borderRight ? "1px" : "none"}
    h="full"
    justifyContent={justifyContent}
    minW={minW}
    w={w}
  >
    {children}
  </Flex>
);

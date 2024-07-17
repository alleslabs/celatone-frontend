import type { BoxProps, FlexboxProps, FlexProps } from "@chakra-ui/react";
import { Flex } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface SectionWrapperProps {
  children: ReactNode;
  minW?: FlexProps["minW"];
  w?: BoxProps["w"];
  justifyContent?: FlexboxProps["justifyContent"];
  borderRight?: boolean;
}

export const SectionWrapper = ({
  children,
  minW = "auto",
  w = "auto",
  justifyContent = "center",
  borderRight = true,
}: SectionWrapperProps) => (
  <Flex
    borderRight={borderRight ? "1px solid" : "none"}
    borderColor="gray.700"
    h="full"
    alignItems="center"
    w={w}
    minW={minW}
    justifyContent={justifyContent}
  >
    {children}
  </Flex>
);

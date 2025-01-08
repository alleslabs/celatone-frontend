import type { BoxProps, FlexboxProps, FlexProps } from "@chakra-ui/react";
import { Flex } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface SectionWrapperProps {
  borderRight?: boolean;
  children: ReactNode;
  justifyContent?: FlexboxProps["justifyContent"];
  minW?: FlexProps["minW"];
  w?: BoxProps["w"];
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
    h="full"
    minW={minW}
    w={w}
    borderColor="gray.700"
    borderRight={borderRight ? "1px solid" : "none"}
    justifyContent={justifyContent}
  >
    {children}
  </Flex>
);

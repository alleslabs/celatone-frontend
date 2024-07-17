import { Flex } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface SectionWrapperProps {
  children: ReactNode;
  minW?: string;
  w?: string;
  justifyContent?: string;
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

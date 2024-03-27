import type { FlexProps } from "@chakra-ui/react";
import { Flex } from "@chakra-ui/react";

const PageHeaderContainer = ({
  children,
  bgColor,
  ...containerProps
}: FlexProps) => (
  <Flex
    as="section"
    direction="column"
    gap={{ base: "24px", md: "32px" }}
    px={{ base: "16px", md: "48px" }}
    pt={{ base: "16px", md: "48px" }}
    bgGradient={
      bgColor
        ? {
            md: `linear(to-b, ${bgColor}, transparent)`,
          }
        : undefined
    }
    {...containerProps}
  >
    {children}
  </Flex>
);

export default PageHeaderContainer;

import type { FlexProps } from "@chakra-ui/react";

import { Flex } from "@chakra-ui/react";

const PageHeaderContainer = ({
  children,
  bgColor,
  ...containerProps
}: FlexProps) => (
  <Flex
    as="section"
    bgGradient={
      bgColor
        ? {
            md: `linear(to-b, ${bgColor}, transparent)`,
          }
        : undefined
    }
    direction="column"
    gap={{ base: "24px", md: "32px" }}
    pt={{ base: "16px", md: "48px" }}
    px={{ base: "16px", md: "48px" }}
    {...containerProps}
  >
    {children}
  </Flex>
);

export default PageHeaderContainer;

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
    position="relative"
    gap={{ base: "24px", md: "32px" }}
    px={{ base: "16px", md: "48px" }}
    pt={{ base: "16px", md: "48px" }}
    sx={{
      "&::before": {
        content: '""',
        display: "block",
        position: "absolute",
        top: 0,
        left: 0,
        width: "full",
        height: 40,
        zIndex: 0,
        bgGradient: bgColor
          ? {
              md: `linear(to-b, ${bgColor}, transparent)`,
            }
          : undefined,
      },
    }}
    {...containerProps}
  >
    {children}
  </Flex>
);

export default PageHeaderContainer;

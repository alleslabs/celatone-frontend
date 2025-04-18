import type { CSSProperties } from "react";

import { Flex } from "@chakra-ui/react";

interface ConnectingLineProp {
  alignment?: "horizontal" | "vertical";
  isFilled?: boolean;
  style?: CSSProperties;
}
const indicatorProp: CSSProperties = {
  border: "solid 2px",
  borderColor: "gray.600",
  borderRadius: "100%",
  height: "12px",
  width: "12px",
};

export const ConnectingLine = ({
  alignment = "vertical",
  isFilled = false,
  style,
}: ConnectingLineProp) => (
  <Flex
    style={style}
    alignItems="center"
    direction={alignment === "vertical" ? "column" : "row"}
    position="absolute"
    top="36px"
  >
    <Flex bgColor="gray.100" sx={indicatorProp} />
    <Flex
      bgColor="gray.600"
      h={alignment === "vertical" ? "24px" : "2px"}
      w={alignment === "vertical" ? "2px" : "24px"}
    />
    <Flex bgColor={isFilled ? "gray.100" : "gray.900"} sx={indicatorProp} />
  </Flex>
);

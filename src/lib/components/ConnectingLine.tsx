import { Flex } from "@chakra-ui/react";
import type { CSSProperties } from "react";

interface ConnectingLineProp {
  alignment?: "horizontal" | "vertical";
  isFilled?: boolean;
  style?: CSSProperties;
}
const indicatorProp: CSSProperties = {
  border: "solid 2px",
  borderColor: "gray.600",
  borderRadius: "100%",
  width: "12px",
  height: "12px",
};

export const ConnectingLine = ({
  alignment = "vertical",
  isFilled = false,
  style,
}: ConnectingLineProp) => (
  <Flex
    top="36px"
    style={style}
    position="absolute"
    alignItems="center"
    direction={alignment === "vertical" ? "column" : "row"}
  >
    <Flex sx={indicatorProp} bgColor="gray.100" />
    <Flex
      h={alignment === "vertical" ? "24px" : "2px"}
      w={alignment === "vertical" ? "2px" : "24px"}
      bgColor="gray.600"
    />
    <Flex sx={indicatorProp} bgColor={isFilled ? "gray.100" : "gray.900"} />
  </Flex>
);

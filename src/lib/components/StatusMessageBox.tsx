import { Flex } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface StatusMessageBoxProps {
  borderColor?: string;
  content: ReactNode;
  pl?: number;
}
export const StatusMessageBox = ({
  borderColor = "primary.main",
  content,
  pl = 6,
}: StatusMessageBoxProps) => (
  <Flex pl={pl} borderColor={borderColor} borderLeft="4px solid">
    {content}
  </Flex>
);

import { Flex } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface StatusMessageBoxProps {
  content: ReactNode;
  borderColor?: string;
  pl?: number;
}
export const StatusMessageBox = ({
  content,
  borderColor = "primary.main",
  pl = 6,
}: StatusMessageBoxProps) => (
  <Flex borderLeft="4px solid" borderColor={borderColor} pl={pl}>
    {content}
  </Flex>
);

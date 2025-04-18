import type { ReactNode } from "react";

import { Flex } from "@chakra-ui/react";

interface StatusMessageBoxProps {
  content: ReactNode;
  borderColor?: string;
  pl?: number;
}
export const StatusMessageBox = ({
  borderColor = "primary.main",
  content,
  pl = 6,
}: StatusMessageBoxProps) => (
  <Flex borderColor={borderColor} borderLeftWidth="4px" pl={pl}>
    {content}
  </Flex>
);

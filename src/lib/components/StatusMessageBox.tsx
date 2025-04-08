import type { ReactNode } from "react";

import { Flex } from "@chakra-ui/react";

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
  <Flex borderColor={borderColor} borderLeft="4px solid" pl={pl}>
    {content}
  </Flex>
);

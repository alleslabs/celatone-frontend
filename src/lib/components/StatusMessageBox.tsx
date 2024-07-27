import { Flex } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface StatusMessageBoxProps {
  content: ReactNode;
  borderColor?: string;
}
export const StatusMessageBox = ({
  content,
  borderColor = "primary.main",
}: StatusMessageBoxProps) => {
  return (
    <Flex borderLeft="4px solid" borderColor={borderColor} pl={6}>
      {content}
    </Flex>
  );
};

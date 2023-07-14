import { Flex } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface TxsTopProps {
  title: ReactNode;
  onViewMore?: () => void;
  relationSelection: ReactNode;
  txTypeSelection: ReactNode;
}
export const TxsTop = ({
  title,
  onViewMore,
  relationSelection,
  txTypeSelection,
}: TxsTopProps) => {
  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      justify="space-between"
      alignItems={{ base: "start", md: "center" }}
    >
      {title}
      {!onViewMore && (
        <Flex
          gap={{ base: 6, md: 4 }}
          mt={{ base: 4, md: 0 }}
          w={{ base: "full", md: "auto" }}
          direction={{ base: "column", md: "row" }}
        >
          {relationSelection}
          {txTypeSelection}
        </Flex>
      )}
    </Flex>
  );
};

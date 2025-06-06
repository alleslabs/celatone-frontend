import type { Option } from "lib/types";
import type { ReactNode } from "react";

import { Flex } from "@chakra-ui/react";
import { TableTitle } from "lib/components/table";

interface TxsTopProps {
  onViewMore?: () => void;
  relationSelection: ReactNode;
  txsCount: Option<number>;
  txTypeSelection: ReactNode;
}
export const TxsTop = ({
  onViewMore,
  relationSelection,
  txsCount,
  txTypeSelection,
}: TxsTopProps) => (
  <Flex
    alignItems={{ base: "start", md: "center" }}
    direction={{ base: "column", md: "row" }}
    justify="space-between"
  >
    <TableTitle count={txsCount} mb={0} title="Transactions" />
    {!onViewMore && (
      <Flex
        direction={{ base: "column", md: "row" }}
        gap={{ base: 6, md: 4 }}
        mt={{ base: 4, md: 0 }}
        w={{ base: "full", md: "auto" }}
      >
        {relationSelection}
        {txTypeSelection}
      </Flex>
    )}
  </Flex>
);

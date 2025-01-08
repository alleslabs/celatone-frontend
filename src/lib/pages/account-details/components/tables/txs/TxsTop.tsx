import { Flex } from "@chakra-ui/react";
import type { ReactNode } from "react";

import { TableTitle } from "lib/components/table";
import type { Option } from "lib/types";

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
    justify="space-between"
    direction={{ base: "column", md: "row" }}
  >
    <TableTitle mb={0} title="Transactions" count={txsCount} />
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

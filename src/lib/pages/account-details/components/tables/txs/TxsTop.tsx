import { Flex } from "@chakra-ui/react";
import type { ReactNode } from "react";

import { TableTitle } from "lib/components/table";
import type { Option } from "lib/types";

interface TxsTopProps {
  txsCount: Option<number>;
  onViewMore?: () => void;
  relationSelection: ReactNode;
  txTypeSelection: ReactNode;
}
export const TxsTop = ({
  txsCount,
  onViewMore,
  relationSelection,
  txTypeSelection,
}: TxsTopProps) => (
  <Flex
    direction={{ base: "column", md: "row" }}
    justify="space-between"
    alignItems={{ base: "start", md: "center" }}
  >
    <TableTitle title="Transactions" count={txsCount} mb={0} />
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

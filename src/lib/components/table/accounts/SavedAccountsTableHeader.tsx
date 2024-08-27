import type { GridProps } from "@chakra-ui/react";
import { Grid } from "@chakra-ui/react";

import { TableHeader } from "../tableComponents";
import { useEvmConfig, useMoveConfig } from "lib/app-provider";

export const SavedAccountsTableHeader = ({
  templateColumns,
}: {
  templateColumns: GridProps["templateColumns"];
}) => {
  const move = useMoveConfig({ shouldRedirect: false });
  const evm = useEvmConfig({ shouldRedirect: false });

  const hasHexAddr = move.enabled || evm.enabled;
  return (
    <Grid templateColumns={templateColumns} minW="min-content">
      <TableHeader>Account Address</TableHeader>
      {hasHexAddr && <TableHeader>Hex Address</TableHeader>}
      <TableHeader>Account Name</TableHeader>
      <TableHeader>Account Description</TableHeader>
      <TableHeader />
    </Grid>
  );
};

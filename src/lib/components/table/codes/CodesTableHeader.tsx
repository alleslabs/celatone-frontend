import type { GridProps } from "@chakra-ui/react";
import { Grid } from "@chakra-ui/react";

import { TableHeader } from "../tableComponents";

export const CodesTableHeader = ({
  templateColumns,
  isReadOnly,
  showCw2andContracts,
}: {
  templateColumns: GridProps["templateColumns"];
  isReadOnly: boolean;
  showCw2andContracts: boolean;
}) => (
  <Grid templateColumns={templateColumns} minW="min-content">
    <TableHeader>Code ID</TableHeader>
    <TableHeader>Code Name</TableHeader>
    {showCw2andContracts && (
      <>
        <TableHeader>CW2 Info</TableHeader>
        <TableHeader textAlign="center">Contracts</TableHeader>
      </>
    )}
    <TableHeader>Uploader</TableHeader>
    <TableHeader>Permission</TableHeader>
    {!isReadOnly && <TableHeader />}
  </Grid>
);

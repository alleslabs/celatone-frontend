import type { GridProps } from "@chakra-ui/react";
import { Grid } from "@chakra-ui/react";

import { TableHeader } from "../tableComponents";

export const CodesTableHeader = ({
  isReadOnly,
  showCw2andContracts,
  templateColumns,
}: {
  isReadOnly: boolean;
  showCw2andContracts: boolean;
  templateColumns: GridProps["templateColumns"];
}) => (
  <Grid minW="min-content" templateColumns={templateColumns}>
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

import type { GridProps } from "@chakra-ui/react";
import { Grid } from "@chakra-ui/react";

import { TableHeader } from "../tableComponents";

export const CodesTableHeader = ({
  templateColumns,
  isReadOnly,
  showCw2andContracts,
  disablePermission,
}: {
  templateColumns: GridProps["templateColumns"];
  isReadOnly: boolean;
  showCw2andContracts: boolean;
  disablePermission: boolean;
}) => (
  <Grid templateColumns={templateColumns} minW="min-content">
    <TableHeader>Code ID</TableHeader>
    <TableHeader>Code name</TableHeader>
    {showCw2andContracts && (
      <>
        <TableHeader>CW2 info</TableHeader>
        <TableHeader textAlign="center">Contracts</TableHeader>
      </>
    )}
    <TableHeader>Uploader</TableHeader>
    {!disablePermission && (
      <>
        <TableHeader>Permission</TableHeader>
        {!isReadOnly && <TableHeader />}
      </>
    )}
  </Grid>
);

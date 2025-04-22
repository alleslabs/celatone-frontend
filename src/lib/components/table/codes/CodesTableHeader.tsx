import type { GridProps } from "@chakra-ui/react";

import { Grid } from "@chakra-ui/react";

import { TableHeader } from "../tableComponents";

export const CodesTableHeader = ({
  disablePermission,
  isReadOnly,
  showCw2andContracts,
  templateColumns,
}: {
  disablePermission: boolean;
  isReadOnly: boolean;
  showCw2andContracts: boolean;
  templateColumns: GridProps["templateColumns"];
}) => (
  <Grid minW="min-content" templateColumns={templateColumns}>
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

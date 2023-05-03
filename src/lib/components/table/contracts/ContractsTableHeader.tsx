import type { GridProps } from "@chakra-ui/react";
import { Grid } from "@chakra-ui/react";

import { TableHeader } from "../tableComponents";

import type { CTAInfo } from "./ContractsTableRowCTA";

export const ContractsTableHeader = ({
  templateColumns,
  isReadOnly,
  withCTA,
}: {
  templateColumns: GridProps["templateColumns"];
  isReadOnly: boolean;
  withCTA?: CTAInfo;
}) => (
  <Grid templateColumns={templateColumns} minW="min-content">
    <TableHeader>Contract Address</TableHeader>
    <TableHeader>Contract Name</TableHeader>
    <TableHeader>Tags</TableHeader>
    <TableHeader>Instantiator</TableHeader>
    {!isReadOnly && (
      <>
        {withCTA ? <TableHeader /> : <TableHeader>Timestamp</TableHeader>}
        <TableHeader />
      </>
    )}
  </Grid>
);

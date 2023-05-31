import type { GridProps } from "@chakra-ui/react";
import { Grid } from "@chakra-ui/react";

import { TableHeader } from "../tableComponents";

import type { CTAInfo } from "./ContractsTableRowCTA";

export const ContractsTableHeader = ({
  templateColumns,
  isReadOnly,
  withCTA,
  withoutTag = false,
}: {
  templateColumns: GridProps["templateColumns"];
  isReadOnly: boolean;
  withCTA?: CTAInfo;
  withoutTag?: boolean;
}) => (
  <Grid templateColumns={templateColumns} minW="min-content">
    <TableHeader>Contract Address</TableHeader>
    <TableHeader>Contract Name</TableHeader>
    {!withoutTag && <TableHeader>Tags</TableHeader>}
    <TableHeader>Instantiator</TableHeader>
    {!isReadOnly && (
      <>
        {withCTA ? <TableHeader /> : <TableHeader>Timestamp</TableHeader>}
        <TableHeader />
      </>
    )}
  </Grid>
);

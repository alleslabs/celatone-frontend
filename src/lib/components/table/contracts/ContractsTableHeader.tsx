import type { GridProps } from "@chakra-ui/react";
import { Grid } from "@chakra-ui/react";

import { TableHeader } from "../tableComponents";

import type { CTAInfo } from "./ContractsTableRowCTA";

export const ContractsTableHeader = ({
  templateColumns,
  showTag,
  showLastUpdate,
  isReadOnly,
  withCTA,
}: {
  templateColumns: GridProps["templateColumns"];
  showTag: boolean;
  showLastUpdate: boolean;
  isReadOnly: boolean;
  withCTA?: CTAInfo;
}) => (
  <Grid templateColumns={templateColumns} minW="min-content">
    <TableHeader>Contract Address</TableHeader>
    <TableHeader>Contract Name</TableHeader>
    {showTag && <TableHeader>Tags</TableHeader>}
    {showLastUpdate && <TableHeader>Instantiator</TableHeader>}
    {!isReadOnly && (
      <>
        {showLastUpdate && (
          <>
            {withCTA ? <TableHeader /> : <TableHeader>Timestamp</TableHeader>}
          </>
        )}
        <TableHeader />
      </>
    )}
  </Grid>
);

import type { GridProps } from "@chakra-ui/react";

import { Grid } from "@chakra-ui/react";

import type { CtaInfo } from "./ContractsTableRowCta";

import { TableHeader } from "../tableComponents";

export const ContractsTableHeader = ({
  templateColumns,
  showTag,
  showLastUpdate,
  isReadOnly,
  withCta,
}: {
  templateColumns: GridProps["templateColumns"];
  showTag: boolean;
  showLastUpdate: boolean;
  isReadOnly: boolean;
  withCta?: CtaInfo;
}) => (
  <Grid templateColumns={templateColumns} minW="min-content">
    <TableHeader>Contract address</TableHeader>
    <TableHeader>Contract name</TableHeader>
    {showTag && <TableHeader>Tags</TableHeader>}
    {showLastUpdate && <TableHeader>Instantiator</TableHeader>}
    {!isReadOnly && (
      <>
        {showLastUpdate && (
          <>
            {withCta ? <TableHeader /> : <TableHeader>Timestamp</TableHeader>}
          </>
        )}
        <TableHeader />
      </>
    )}
  </Grid>
);

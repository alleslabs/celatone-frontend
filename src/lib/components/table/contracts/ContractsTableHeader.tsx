import type { GridProps } from "@chakra-ui/react";

import { Grid } from "@chakra-ui/react";

import type { CtaInfo } from "./ContractsTableRowCta";

import { TableHeader } from "../tableComponents";

export const ContractsTableHeader = ({
  isReadOnly,
  showLastUpdate,
  showTag,
  templateColumns,
  withCta,
}: {
  isReadOnly: boolean;
  showLastUpdate: boolean;
  showTag: boolean;
  templateColumns: GridProps["templateColumns"];
  withCta?: CtaInfo;
}) => (
  <Grid minW="min-content" templateColumns={templateColumns}>
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

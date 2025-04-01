import type { GridProps } from "@chakra-ui/react";
import { Grid } from "@chakra-ui/react";

import { useTierConfig } from "lib/app-provider";
import { TableHeader } from "lib/components/table";

export const MigrationHeader = ({
  templateColumns,
}: {
  templateColumns: GridProps["templateColumns"];
}) => {
  const { isFullTier } = useTierConfig();

  return (
    <Grid templateColumns={templateColumns}>
      <TableHeader>Code ID</TableHeader>
      <TableHeader>Code name</TableHeader>
      {isFullTier && (
        <>
          <TableHeader>CW2 info</TableHeader>
          <TableHeader>Sender</TableHeader>
        </>
      )}
      <TableHeader>Block height</TableHeader>
      {isFullTier && (
        <>
          <TableHeader>Timestamp</TableHeader>
          <TableHeader>Remark</TableHeader>
        </>
      )}
    </Grid>
  );
};

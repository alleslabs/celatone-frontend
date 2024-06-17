import type { GridProps } from "@chakra-ui/react";
import { Grid } from "@chakra-ui/react";

import { useTierConfig } from "lib/app-provider";
import { TableHeader } from "lib/components/table";

export const MigrationHeader = ({
  templateColumns,
}: {
  templateColumns: GridProps["templateColumns"];
}) => {
  const isFullTier = useTierConfig() === "full";

  return (
    <Grid templateColumns={templateColumns}>
      <TableHeader>Code ID</TableHeader>
      <TableHeader>Code Name</TableHeader>
      {isFullTier && (
        <>
          <TableHeader>CW2 Info</TableHeader>
          <TableHeader>Sender</TableHeader>
        </>
      )}
      <TableHeader>Block Height</TableHeader>
      {isFullTier && (
        <>
          <TableHeader>Timestamp</TableHeader>
          <TableHeader>Remark</TableHeader>
        </>
      )}
    </Grid>
  );
};

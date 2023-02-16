import type { GridProps } from "@chakra-ui/react";
import { Grid } from "@chakra-ui/react";

import { TableHeader } from "lib/components/table";

export const RelatedProposalsHeader = ({
  templateColumns,
}: {
  templateColumns: GridProps["templateColumns"];
}) => {
  return (
    <Grid templateColumns={templateColumns}>
      <TableHeader>Proposal ID</TableHeader>
      <TableHeader>Proposal Title</TableHeader>
      <TableHeader textAlign="center">Status</TableHeader>
      <TableHeader>Vote Finish on</TableHeader>
      <TableHeader>Resolve Block Height</TableHeader>
      <TableHeader>Type</TableHeader>
      <TableHeader>Proposer</TableHeader>
    </Grid>
  );
};

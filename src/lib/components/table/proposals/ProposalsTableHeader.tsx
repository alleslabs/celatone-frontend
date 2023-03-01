import type { GridProps } from "@chakra-ui/react";
import { Grid } from "@chakra-ui/react";

import { TableHeader } from "../tableComponents";

export const ProposalsTableHeader = ({
  templateColumns,
}: {
  templateColumns: GridProps["templateColumns"];
}) => (
  <Grid templateColumns={templateColumns}>
    <TableHeader>Proposal ID</TableHeader>
    <TableHeader>Proposal Title</TableHeader>
    <TableHeader textAlign="center">Status</TableHeader>
    <TableHeader>Vote Finish on</TableHeader>
    <TableHeader>Resolved Block Height</TableHeader>
    <TableHeader>Type</TableHeader>
    <TableHeader>Proposer</TableHeader>
  </Grid>
);

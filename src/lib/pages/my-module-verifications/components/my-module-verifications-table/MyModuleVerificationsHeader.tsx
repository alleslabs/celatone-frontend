import type { GridProps } from "@chakra-ui/react";

import { Grid } from "@chakra-ui/react";
import { TableHeader } from "lib/components/table";

interface ModulesTableHeaderProps {
  templateColumns: GridProps["templateColumns"];
}
export const MyModuleVerificationsTableHeader = ({
  templateColumns,
}: ModulesTableHeaderProps) => (
  <Grid minW="min-content" templateColumns={templateColumns}>
    <TableHeader>Request ID</TableHeader>
    <TableHeader>Request note</TableHeader>
    <TableHeader>Files</TableHeader>
    <TableHeader>Status</TableHeader>
    <TableHeader>Verified at</TableHeader>
  </Grid>
);

import type { GridProps } from "@chakra-ui/react";
import { Grid } from "@chakra-ui/react";

import { TableHeader } from "../tableComponents";

interface ModulesTableHeaderProps {
  templateColumns: GridProps["templateColumns"];
  isPublishedModules?: boolean;
}
export const ModulesTableHeader = ({
  templateColumns,
  isPublishedModules = false,
}: ModulesTableHeaderProps) => (
  <Grid templateColumns={templateColumns} minW="min-content">
    <TableHeader>Module Path</TableHeader>
    {isPublishedModules && <TableHeader>Module Name</TableHeader>}
    {isPublishedModules && <TableHeader>View/Execute Functions</TableHeader>}
    <TableHeader>Creator</TableHeader>
    {!isPublishedModules && <TableHeader>Timestamp</TableHeader>}
    <TableHeader />
  </Grid>
);

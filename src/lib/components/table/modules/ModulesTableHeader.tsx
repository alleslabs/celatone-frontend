import type { GridProps } from "@chakra-ui/react";
import { Grid } from "@chakra-ui/react";

import { TableHeader } from "../tableComponents";

interface ModulesTableHeaderProps {
  templateColumns: GridProps["templateColumns"];
  isPublishedModules: boolean;
}
export const ModulesTableHeader = ({
  templateColumns,
  isPublishedModules,
}: ModulesTableHeaderProps) => (
  <Grid templateColumns={templateColumns} minW="min-content">
    <TableHeader>Module Path</TableHeader>
    {isPublishedModules && (
      <>
        <TableHeader>Module Name</TableHeader>
        <TableHeader w="full" textAlign="center">
          View/Execute Functions
        </TableHeader>
      </>
    )}
    <TableHeader>Creator</TableHeader>
    {!isPublishedModules && (
      <>
        <TableHeader>Publishing Activity</TableHeader>
        <TableHeader>Published/Republished Timestamp</TableHeader>
      </>
    )}
    <TableHeader />
  </Grid>
);

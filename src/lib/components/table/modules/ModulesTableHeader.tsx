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
    <TableHeader>Module path</TableHeader>
    {isPublishedModules && (
      <>
        <TableHeader>Module name</TableHeader>
        <TableHeader w="full" textAlign="center">
          View/Execute functions
        </TableHeader>
      </>
    )}
    <TableHeader>Creator</TableHeader>
    {!isPublishedModules && (
      <>
        <TableHeader>Publishing activity</TableHeader>
        <TableHeader>Published/Republished timestamp</TableHeader>
      </>
    )}
    <TableHeader />
  </Grid>
);

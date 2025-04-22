import type { GridProps } from "@chakra-ui/react";

import { Grid } from "@chakra-ui/react";

import { TableHeader } from "../tableComponents";

interface ModulesTableHeaderProps {
  isPublishedModules: boolean;
  templateColumns: GridProps["templateColumns"];
}
export const ModulesTableHeader = ({
  isPublishedModules,
  templateColumns,
}: ModulesTableHeaderProps) => (
  <Grid minW="min-content" templateColumns={templateColumns}>
    <TableHeader>Module path</TableHeader>
    {isPublishedModules && (
      <>
        <TableHeader>Module name</TableHeader>
        <TableHeader textAlign="center" w="full">
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

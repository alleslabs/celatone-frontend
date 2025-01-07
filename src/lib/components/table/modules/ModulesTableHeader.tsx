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
    <TableHeader>Module Path</TableHeader>
    {isPublishedModules && (
      <>
        <TableHeader>Module Name</TableHeader>
        <TableHeader textAlign="center" w="full">
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

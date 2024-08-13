import { Grid } from "@chakra-ui/react";

import { TableHeader } from "../tableComponents";

interface ModuleVerificationDetailsTableHeaderProps {
  templateColumns: string;
}

export const ModuleVerificationDetailsTableHeader = ({
  templateColumns,
}: ModuleVerificationDetailsTableHeaderProps) => (
  <Grid templateColumns={templateColumns} minW="min-content">
    <TableHeader>Module Path</TableHeader>
  </Grid>
);

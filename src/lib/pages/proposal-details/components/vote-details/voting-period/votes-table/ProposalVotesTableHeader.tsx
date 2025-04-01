import type { GridProps } from "@chakra-ui/react";
import { Grid } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { TableHeader } from "lib/components/table";

interface ProposalVotesTableHeaderProps {
  templateColumns: GridProps["templateColumns"];
  fullVersion: boolean;
}

export const ProposalVotesTableHeader = ({
  templateColumns,
  fullVersion,
}: ProposalVotesTableHeaderProps) => {
  const isMobile = useMobile();

  if (isMobile)
    return (
      <Grid templateColumns={templateColumns} minW="min-content">
        <TableHeader pl={0}>Address (Vote Answer)</TableHeader>
        <TableHeader />
      </Grid>
    );

  return (
    <Grid templateColumns={templateColumns} minW="min-content">
      <TableHeader>Voters</TableHeader>
      <TableHeader>Answer</TableHeader>
      {fullVersion && (
        <>
          <TableHeader>Timestamp</TableHeader>
          <TableHeader>Transaction hash</TableHeader>
        </>
      )}
    </Grid>
  );
};

import type { GridProps } from "@chakra-ui/react";

import { Grid } from "@chakra-ui/react";
import { useMobile } from "lib/app-provider";
import { TableHeader } from "lib/components/table";

interface ProposalVotesTableHeaderProps {
  templateColumns: GridProps["templateColumns"];
  fullVersion: boolean;
}

export const ProposalVotesTableHeader = ({
  fullVersion,
  templateColumns,
}: ProposalVotesTableHeaderProps) => {
  const isMobile = useMobile();

  if (isMobile)
    return (
      <Grid minW="min-content" templateColumns={templateColumns}>
        <TableHeader pl={0}>Address (Vote answer)</TableHeader>
        <TableHeader />
      </Grid>
    );

  return (
    <Grid minW="min-content" templateColumns={templateColumns}>
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

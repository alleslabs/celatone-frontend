import type { GridProps } from "@chakra-ui/react";
import { Grid } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { TableHeader } from "lib/components/table";

interface ValidatorVotesTableHeaderProps {
  templateColumns: GridProps["templateColumns"];
  fullVersion: boolean;
  isProposalResolved: boolean;
}

export const ValidatorVotesTableHeader = ({
  templateColumns,
  fullVersion,
  isProposalResolved,
}: ValidatorVotesTableHeaderProps) => {
  const isMobile = useMobile();

  if (isMobile)
    return (
      <Grid templateColumns={templateColumns} minW="min-content">
        {!isProposalResolved && <TableHeader pl={0}>#</TableHeader>}
        <TableHeader>Validators (Vote Answer)</TableHeader>
        <TableHeader />
      </Grid>
    );

  return (
    <Grid templateColumns={templateColumns} minW="min-content">
      {!isProposalResolved && (
        <TableHeader>{fullVersion && "Rank"}</TableHeader>
      )}
      <TableHeader>Validators</TableHeader>
      <TableHeader>Votes</TableHeader>
      {fullVersion && (
        <>
          <TableHeader>Timestamp</TableHeader>
          <TableHeader>Transaction Hash</TableHeader>
        </>
      )}
    </Grid>
  );
};

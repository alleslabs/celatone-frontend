import type { GridProps } from "@chakra-ui/react";

import { Grid } from "@chakra-ui/react";
import { useMobile } from "lib/app-provider";
import { TableHeader } from "lib/components/table";

interface ValidatorVotesTableHeaderProps {
  fullVersion: boolean;
  isProposalResolved: boolean;
  templateColumns: GridProps["templateColumns"];
}

export const ValidatorVotesTableHeader = ({
  fullVersion,
  isProposalResolved,
  templateColumns,
}: ValidatorVotesTableHeaderProps) => {
  const isMobile = useMobile();

  if (isMobile)
    return (
      <Grid minW="min-content" templateColumns={templateColumns}>
        {!isProposalResolved && <TableHeader pl={0}>#</TableHeader>}
        <TableHeader>Validators (Vote answer)</TableHeader>
        <TableHeader />
      </Grid>
    );

  return (
    <Grid minW="min-content" templateColumns={templateColumns}>
      {!isProposalResolved && (
        <TableHeader>{fullVersion && "Rank"}</TableHeader>
      )}
      <TableHeader>Validators</TableHeader>
      <TableHeader>Votes</TableHeader>
      {fullVersion && (
        <>
          <TableHeader>Timestamp</TableHeader>
          <TableHeader>Transaction hash</TableHeader>
        </>
      )}
    </Grid>
  );
};

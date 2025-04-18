import { Heading } from "@chakra-ui/react";

import { DepositOverview } from "./DepositOverview";
import { VotingOverview } from "./VotingOverview";
import type { ProposalOverviewProps } from "..";
import { ProposalStepper } from "../../proposal-stepper";

export const ProposalPeriodOverview = ({
  proposalData,
  ...props
}: ProposalOverviewProps) => (
  <div>
    <Heading as="h6" variant="h6" mb={4}>
      Proposal period
    </Heading>
    <ProposalStepper step={1} proposalData={proposalData} isOverview />
    <DepositOverview proposalData={proposalData} {...props} />
    <ProposalStepper step={2} proposalData={proposalData} isOverview />
    <VotingOverview proposalData={proposalData} {...props} />
  </div>
);

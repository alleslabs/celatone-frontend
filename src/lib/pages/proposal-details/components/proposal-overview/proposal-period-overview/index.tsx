import { Heading } from "@chakra-ui/react";

import type { ProposalOverviewProps } from "..";

import { ProposalStepper } from "../../proposal-stepper";
import { DepositOverview } from "./DepositOverview";
import { VotingOverview } from "./VotingOverview";

export const ProposalPeriodOverview = ({
  proposalData,
  ...props
}: ProposalOverviewProps) => (
  <div>
    <Heading as="h6" mb={4} variant="h6">
      Proposal period
    </Heading>
    <ProposalStepper isOverview proposalData={proposalData} step={1} />
    <DepositOverview proposalData={proposalData} {...props} />
    <ProposalStepper isOverview proposalData={proposalData} step={2} />
    <VotingOverview proposalData={proposalData} {...props} />
  </div>
);

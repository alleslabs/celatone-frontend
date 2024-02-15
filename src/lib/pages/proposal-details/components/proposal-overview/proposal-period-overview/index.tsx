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
    <Heading as="h6" variant="h6" mb={4}>
      Proposal Period
    </Heading>
    <ProposalStepper step={1} proposalData={proposalData} isOverview />
    <DepositOverview proposalData={proposalData} {...props} />
    <ProposalStepper step={2} proposalData={proposalData} isOverview />
    <VotingOverview proposalData={proposalData} {...props} />
  </div>
);

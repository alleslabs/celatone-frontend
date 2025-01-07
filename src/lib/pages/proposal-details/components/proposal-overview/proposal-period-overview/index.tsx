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
      Proposal Period
    </Heading>
    <ProposalStepper isOverview step={1} proposalData={proposalData} />
    <DepositOverview proposalData={proposalData} {...props} />
    <ProposalStepper isOverview step={2} proposalData={proposalData} />
    <VotingOverview proposalData={proposalData} {...props} />
  </div>
);

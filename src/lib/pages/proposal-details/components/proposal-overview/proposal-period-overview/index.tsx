import { Heading } from "@chakra-ui/react";

import type { ProposalOverviewProps } from "..";
import { ProposalStepper } from "../../proposal-stepper";

import { DepositPeriodOverview } from "./DepositPeriodOverview";

export const ProposalPeriodOverview = ({
  proposalData,
  ...props
}: ProposalOverviewProps) => (
  <div>
    <Heading as="h6" variant="h6" mb={4}>
      Proposal Period
    </Heading>
    <ProposalStepper step={1} proposalData={proposalData} isOverview />
    <DepositPeriodOverview proposalData={proposalData} {...props} />
    <ProposalStepper step={2} proposalData={proposalData} isOverview />
  </div>
);

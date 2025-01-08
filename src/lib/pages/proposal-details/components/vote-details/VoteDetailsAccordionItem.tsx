import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from "@chakra-ui/react";
import type { ReactNode } from "react";

import { ProposalStepper } from "../proposal-stepper";
import type { ProposalData } from "lib/types";

interface VoteDetailsAccordionItemProps {
  children: ReactNode;
  isDisabled?: boolean;
  proposalData: ProposalData;
  step: number;
}

export const VoteDetailsAccordionItem = ({
  children,
  isDisabled,
  proposalData,
  step,
}: VoteDetailsAccordionItemProps) => (
  <AccordionItem
    isDisabled={isDisabled}
    borderColor="gray.700"
    borderTop="1px solid"
  >
    <AccordionButton px={0} py={3}>
      <ProposalStepper step={step} proposalData={proposalData} />
      <AccordionIcon ml="auto" color="gray.600" />
    </AccordionButton>
    <AccordionPanel
      bg="transparent"
      p={0}
      pb={step === 1 ? 0 : 4}
      pt={3}
      borderColor="gray.700"
      borderTop="1px solid"
    >
      {children}
    </AccordionPanel>
  </AccordionItem>
);

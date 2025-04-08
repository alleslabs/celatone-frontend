import type { ProposalData } from "lib/types";
import type { ReactNode } from "react";

import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from "@chakra-ui/react";

import { ProposalStepper } from "../proposal-stepper";

interface VoteDetailsAccordionItemProps {
  step: number;
  proposalData: ProposalData;
  children: ReactNode;
  isDisabled?: boolean;
}

export const VoteDetailsAccordionItem = ({
  step,
  proposalData,
  children,
  isDisabled,
}: VoteDetailsAccordionItemProps) => (
  <AccordionItem
    borderColor="gray.700"
    borderTop="1px solid"
    isDisabled={isDisabled}
  >
    <AccordionButton px={0} py={3}>
      <ProposalStepper proposalData={proposalData} step={step} />
      <AccordionIcon color="gray.600" ml="auto" />
    </AccordionButton>
    <AccordionPanel
      bg="transparent"
      borderColor="gray.700"
      borderTop="1px solid"
      p={0}
      pb={step === 1 ? 0 : 4}
      pt={3}
    >
      {children}
    </AccordionPanel>
  </AccordionItem>
);

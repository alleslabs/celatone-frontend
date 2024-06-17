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
    borderTop="1px solid"
    borderColor="gray.700"
    isDisabled={isDisabled}
  >
    <AccordionButton py={3} px={0}>
      <ProposalStepper step={step} proposalData={proposalData} />
      <AccordionIcon color="gray.600" ml="auto" />
    </AccordionButton>
    <AccordionPanel
      bg="transparent"
      p={0}
      pt={3}
      pb={step === 1 ? 0 : 4}
      borderTop="1px solid"
      borderColor="gray.700"
    >
      {children}
    </AccordionPanel>
  </AccordionItem>
);

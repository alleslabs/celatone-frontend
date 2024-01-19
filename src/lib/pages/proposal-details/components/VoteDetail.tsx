import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Flex,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import type { ReactNode } from "react";

import { useMobile } from "lib/app-provider";

import { ProposalStepper } from "./ProposalStepper";
import { VoteDetailTab } from "./VoteDetailTab";

const AccordionItemComponent = ({
  step,
  title,
  description,
  children,
}: {
  step: number;
  title: string;
  description: string;
  children: ReactNode;
}) => (
  <AccordionItem borderTop="1px solid" borderColor="gray.700">
    {({ isExpanded }) => (
      <>
        <AccordionButton py={3} px={0}>
          <ProposalStepper
            step={step}
            title={title}
            description={description}
            isSelected={isExpanded}
          />
          <AccordionIcon color="gray.600" ml="auto" />
        </AccordionButton>
        <AccordionPanel
          bg="transparent"
          py={3}
          px={0}
          borderTop="1px solid"
          borderColor="gray.700"
        >
          {children}
        </AccordionPanel>
      </>
    )}
  </AccordionItem>
);

export const VoteDetail = () => {
  const isMobile = useMobile();
  const accordionData = [
    {
      step: 1,
      title: "Deposit Period",
      description: "Deposit ends in 4 days 21:00:11",
      content: <Flex>Deposit Period Content</Flex>,
    },
    {
      step: 2,
      title: "Voting Period",
      description: "Voting ends in 3 days 12:00:10",
      content: <Flex>Voting Period Content</Flex>,
    },
  ];
  return isMobile ? (
    <Flex>
      <Accordion allowToggle w="full" defaultIndex={[0]} variant="transparent">
        {accordionData.map((item) => (
          <AccordionItemComponent key={item.step} {...item}>
            {item.content}
          </AccordionItemComponent>
        ))}
      </Accordion>
    </Flex>
  ) : (
    <Flex mt={8}>
      {/* To add index to Tabs */}
      <Tabs isLazy lazyBehavior="keepMounted" w="full">
        <TabList borderBottom="0px solid" gap={2}>
          {accordionData.map((item) => (
            <VoteDetailTab
              key={item.step}
              step={item.step}
              title={item.title}
              description={item.description}
            />
          ))}
        </TabList>
        <TabPanels
          background="gray.800"
          p={6}
          border="1px solid"
          borderColor="gray.700"
          borderTopColor="transparent"
          borderRadius="0px 0px 8px 8px"
        >
          {accordionData.map((item) => (
            <TabPanel>{item.content}</TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Flex>
  );
};

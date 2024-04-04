import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Text,
} from "@chakra-ui/react";

import { trackUseExpand } from "lib/amplitude";
import JsonReadOnly from "lib/components/json/JsonReadOnly";

interface ProposalMessageCardProps {
  header: string;
  jsonString: string;
}

export const ProposalMessageCard = ({
  header,
  jsonString,
}: ProposalMessageCardProps) => (
  <AccordionItem mb={4}>
    {({ isExpanded }) => (
      <>
        <AccordionButton
          background="gray.900"
          borderRadius={8}
          px={4}
          justifyContent="space-between"
          alignItems="center"
          _hover={{ background: "gray.900" }}
          onClick={() =>
            trackUseExpand({
              action: !isExpanded ? "expand" : "collapse",
              component: "proposal_message_card",
              section: "proposal message",
            })
          }
        >
          <Text
            variant="body1"
            fontWeight={600}
            wordBreak="break-all"
            textAlign="start"
          >
            {header}
          </Text>
          <AccordionIcon color="gray.600" />
        </AccordionButton>
        <AccordionPanel p={0} pt={4}>
          <JsonReadOnly text={jsonString} canCopy isExpandable />
        </AccordionPanel>
      </>
    )}
  </AccordionItem>
);

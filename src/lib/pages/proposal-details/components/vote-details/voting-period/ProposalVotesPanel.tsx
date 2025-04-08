import type { ProposalAnswerCountsResponse } from "lib/services/types";
import type { Option } from "lib/types";

import { Button, Flex } from "@chakra-ui/react";
import { useMobile } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { TableTitle } from "lib/components/table";

import { ProposalVotesTable } from "./votes-table";

interface ProposalVotesPanelProps {
  answers: Option<ProposalAnswerCountsResponse["all"]>;
  id: number;
  isOpen: boolean;
  onBack: () => void;
}

export const ProposalVotesPanel = ({
  isOpen,
  onBack,
  answers,
  id,
}: ProposalVotesPanelProps) => {
  const isMobile = useMobile();

  return (
    <Flex
      background={isMobile ? "transparent" : "gray.900"}
      border="1px solid"
      borderColor={isMobile ? "transparent" : "gray.700"}
      borderRadius="8px"
      bottom={0}
      direction="column"
      gap={4}
      left={isOpen ? "0" : "100%"}
      opacity={isOpen ? 1 : 0}
      overflowY="auto"
      p={isMobile ? 0 : 6}
      pointerEvents={isOpen ? "auto" : "none"}
      position={isOpen ? "relative" : "absolute"}
      top={0}
      transition="all 0.25s ease-in-out"
      w="full"
    >
      <Flex gap={2}>
        <Button p={0} size="sm" variant="ghost-gray" onClick={onBack}>
          <CustomIcon boxSize={4} name="chevron-left" />
        </Button>
        <TableTitle count={answers?.total} mb={0} title="All votes" />
      </Flex>
      <ProposalVotesTable
        id={id}
        answers={answers}
        enabled={isOpen}
        fullVersion
      />
    </Flex>
  );
};

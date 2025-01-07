import { Button, Flex } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { TableTitle } from "lib/components/table";
import type { ProposalAnswerCountsResponse } from "lib/services/types";
import type { Option } from "lib/types";

import { ProposalVotesTable } from "./votes-table";

interface ProposalVotesPanelProps {
  answers: Option<ProposalAnswerCountsResponse["all"]>;
  id: number;
  isOpen: boolean;
  onBack: () => void;
}

export const ProposalVotesPanel = ({
  answers,
  id,
  isOpen,
  onBack,
}: ProposalVotesPanelProps) => {
  const isMobile = useMobile();

  return (
    <Flex
      gap={4}
      left={isOpen ? "0" : "100%"}
      p={isMobile ? 0 : 6}
      w="full"
      background={isMobile ? "transparent" : "gray.900"}
      border="1px solid"
      borderColor={isMobile ? "transparent" : "gray.700"}
      borderRadius="8px"
      bottom={0}
      direction="column"
      opacity={isOpen ? 1 : 0}
      overflowY="auto"
      pointerEvents={isOpen ? "auto" : "none"}
      position={isOpen ? "relative" : "absolute"}
      top={0}
      transition="all 0.25s ease-in-out"
    >
      <Flex gap={2}>
        <Button p={0} size="sm" variant="ghost-gray" onClick={onBack}>
          <CustomIcon name="chevron-left" boxSize={4} />
        </Button>
        <TableTitle mb={0} title="All Votes" count={answers?.total} />
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

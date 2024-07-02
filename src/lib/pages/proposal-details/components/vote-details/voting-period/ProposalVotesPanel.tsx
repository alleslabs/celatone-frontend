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
  isOpen,
  onBack,
  answers,
  id,
}: ProposalVotesPanelProps) => {
  const isMobile = useMobile();

  return (
    <Flex
      w="full"
      position={isOpen ? "relative" : "absolute"}
      opacity={isOpen ? 1 : 0}
      left={isOpen ? "0" : "100%"}
      top={0}
      bottom={0}
      overflowY="auto"
      transition="all 0.25s ease-in-out"
      direction="column"
      background={isMobile ? "transparent" : "gray.900"}
      border="1px solid"
      borderColor={isMobile ? "transparent" : "gray.700"}
      pointerEvents={isOpen ? "auto" : "none"}
      borderRadius="8px"
      p={isMobile ? 0 : 6}
      gap={4}
    >
      <Flex gap={2}>
        <Button variant="ghost-gray" size="sm" p={0} onClick={onBack}>
          <CustomIcon name="chevron-left" boxSize={4} />
        </Button>
        <TableTitle title="All Votes" count={answers?.total} mb={0} />
      </Flex>
      <ProposalVotesTable
        id={id}
        answers={answers}
        fullVersion
        enabled={isOpen}
      />
    </Flex>
  );
};

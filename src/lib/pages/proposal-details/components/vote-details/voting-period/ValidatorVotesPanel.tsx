import { Button, Flex } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { TableTitle } from "lib/components/table";
import type { ProposalAnswerCountsResponse } from "lib/services/proposal";
import type { Option } from "lib/types";

import { ValidatorVotesTable } from "./validator-votes-table";

interface ValidatorVotesPanelProps {
  answers: Option<ProposalAnswerCountsResponse["validator"]>;
  id: number;
  isOpen: boolean;
  isProposalResolved: boolean;
  onBack: () => void;
}

export const ValidatorVotesPanel = ({
  isOpen,
  onBack,
  answers,
  id,
  isProposalResolved,
}: ValidatorVotesPanelProps) => {
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
      borderRadius="8px"
      pointerEvents={isOpen ? "auto" : "none"}
      p={isMobile ? 0 : 6}
      gap={4}
    >
      <Flex gap={2}>
        <Button variant="ghost-gray" size="sm" p={0} onClick={onBack}>
          <CustomIcon name="chevron-left" boxSize={4} />
        </Button>
        <TableTitle title="Validator Votes" count={answers?.total} />
      </Flex>
      <ValidatorVotesTable
        id={id}
        answers={answers}
        fullVersion
        isProposalResolved={isProposalResolved}
        enabled={isOpen}
      />
    </Flex>
  );
};

import { Box, Flex, Heading } from "@chakra-ui/react";
import { useCallback, useState } from "react";

import { LabelText } from "lib/components/LabelText";
import { ValidatorBadge } from "lib/components/ValidatorBadge";
import type { BlockDetails } from "lib/types";
import { formatInteger } from "lib/utils";

interface BlockInfoProps {
  blockData: BlockDetails;
}

export const BlockInfo = ({ blockData }: BlockInfoProps) => {
  const [proposerWidth, setProposerWidth] = useState<number>();
  const measuredRef = useCallback((node: HTMLDivElement | null) => {
    if (node !== null) {
      setProposerWidth(node.clientWidth);
    }
  }, []);
  return (
    <Box mb={12}>
      <Heading as="h6" variant="h6" mb={6}>
        Block Information
      </Heading>
      <Flex gap="64px">
        <LabelText label="Network">{blockData.network}</LabelText>
        <LabelText
          label="Proposed by"
          ref={measuredRef}
          w={proposerWidth ? `${proposerWidth}px` : undefined}
        >
          <ValidatorBadge validator={blockData.proposer} badgeSize={6} />
        </LabelText>
        <LabelText label="Gas (Used/Wanted)">
          {`${blockData.gasUsed ? formatInteger(blockData.gasUsed) : 0} / ${
            blockData.gasLimit ? formatInteger(blockData.gasLimit) : 0
          }`}
        </LabelText>
      </Flex>
    </Box>
  );
};

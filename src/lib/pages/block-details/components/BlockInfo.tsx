import { Box, Flex, Heading } from "@chakra-ui/react";

import { LabelText } from "lib/components/LabelText";
import { ValidatorBadge } from "lib/components/ValidatorBadge";
import type { BlockDetails } from "lib/types";
import { formatInteger } from "lib/utils";

interface BlockInfoProps {
  blockData: BlockDetails;
}

export const BlockInfo = ({ blockData }: BlockInfoProps) => {
  return (
    <Box mb={12}>
      <Heading as="h6" variant="h6" mb={6}>
        Block Info
      </Heading>
      <Flex gap={{ base: 4, md: 12 }} direction={{ base: "column", md: "row" }}>
        <Flex direction="row" flex="1" maxW={{ md: "400px" }}>
          <LabelText flex="1" label="Network">
            {blockData.network}
          </LabelText>
          <LabelText flex="1" label="Gas (Used/Wanted)">
            {`${blockData.gasUsed ? formatInteger(blockData.gasUsed) : 0} / ${
              blockData.gasLimit ? formatInteger(blockData.gasLimit) : 0
            }`}
          </LabelText>
        </Flex>
        <LabelText label="Proposed by" flex="1">
          <ValidatorBadge
            validator={blockData.proposer}
            badgeSize={6}
            hasLabel={false}
          />
        </LabelText>
      </Flex>
    </Box>
  );
};

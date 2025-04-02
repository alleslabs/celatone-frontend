import type { BlockData } from "lib/types";

import { Box, Flex, Heading } from "@chakra-ui/react";
import { useCelatoneApp, useTierConfig } from "lib/app-provider";
import { LabelText } from "lib/components/LabelText";
import { ValidatorBadge } from "lib/components/ValidatorBadge";
import { formatInteger } from "lib/utils";

interface BlockInfoProps {
  blockData: BlockData;
}

export const BlockInfo = ({ blockData }: BlockInfoProps) => {
  const { currentChainId } = useCelatoneApp();
  const { isLiteTier } = useTierConfig();
  return (
    <Box mb={12}>
      <Flex justifyContent="space-between" mb={6}>
        <Heading as="h6" variant="h6">
          Block Info
        </Heading>
      </Flex>
      {!isLiteTier ? (
        <Flex
          direction={{ base: "column", md: "row" }}
          gap={{ base: 4, md: 12 }}
        >
          <Flex direction="row" flex={1} gap={1} maxW={{ md: "400px" }}>
            <LabelText flex={1} label="Network">
              {currentChainId}
            </LabelText>
            <LabelText flex={1} label="Gas (Used/Wanted)">
              {`${blockData.gasUsed ? formatInteger(blockData.gasUsed) : 0} / ${
                blockData.gasLimit ? formatInteger(blockData.gasLimit) : 0
              }`}
            </LabelText>
          </Flex>
          <LabelText flex={1} label="Proposed by" minW={0}>
            <ValidatorBadge
              badgeSize={6}
              hasLabel={false}
              validator={blockData.proposer}
            />
          </LabelText>
        </Flex>
      ) : (
        <Flex direction="row" flex={1} maxW={{ md: "400px" }}>
          <LabelText flex={1} label="Network">
            {currentChainId}
          </LabelText>
          <LabelText flex={1} label="Proposed by" minW={0}>
            <ValidatorBadge
              badgeSize={6}
              hasLabel={false}
              validator={blockData.proposer}
            />
          </LabelText>
        </Flex>
      )}
    </Box>
  );
};

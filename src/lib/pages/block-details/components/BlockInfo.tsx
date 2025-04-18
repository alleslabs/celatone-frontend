import { Box, Flex, Heading } from "@chakra-ui/react";

import { useCelatoneApp, useTierConfig } from "lib/app-provider";
import { LabelText } from "lib/components/LabelText";
import { ValidatorBadge } from "lib/components/ValidatorBadge";
import type { BlockData } from "lib/types";
import { formatInteger } from "lib/utils";

interface BlockInfoProps {
  blockData: BlockData;
}

export const BlockInfo = ({ blockData }: BlockInfoProps) => {
  const { currentChainId } = useCelatoneApp();
  const { isLiteTier } = useTierConfig();
  return (
    <Box mb={12}>
      <Flex mb={6} justifyContent="space-between">
        <Heading as="h6" variant="h6">
          Block info
        </Heading>
      </Flex>
      {!isLiteTier ? (
        <Flex
          gap={{ base: 4, md: 12 }}
          direction={{ base: "column", md: "row" }}
        >
          <Flex direction="row" gap={1} flex={1} maxW={{ md: "400px" }}>
            <LabelText flex={1} label="Network">
              {currentChainId}
            </LabelText>
            <LabelText flex={1} label="Gas (Used/Wanted)">
              {`${blockData.gasUsed ? formatInteger(blockData.gasUsed) : 0} / ${
                blockData.gasLimit ? formatInteger(blockData.gasLimit) : 0
              }`}
            </LabelText>
          </Flex>
          <LabelText label="Proposed by" flex={1} minW={0}>
            <ValidatorBadge
              validator={blockData.proposer}
              badgeSize={6}
              hasLabel={false}
            />
          </LabelText>
        </Flex>
      ) : (
        <Flex direction="row" flex={1} maxW={{ md: "400px" }}>
          <LabelText flex={1} label="Network">
            {currentChainId}
          </LabelText>
          <LabelText label="Proposed by" flex={1} minW={0}>
            <ValidatorBadge
              validator={blockData.proposer}
              badgeSize={6}
              hasLabel={false}
            />
          </LabelText>
        </Flex>
      )}
    </Box>
  );
};

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
          Block Info
        </Heading>
      </Flex>
      {!isLiteTier ? (
        <Flex
          gap={{ base: 4, md: 12 }}
          direction={{ base: "column", md: "row" }}
        >
          <Flex flex={1} gap={1} maxW={{ md: "400px" }} direction="row">
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
              validator={blockData.proposer}
              badgeSize={6}
              hasLabel={false}
            />
          </LabelText>
        </Flex>
      ) : (
        <Flex flex={1} maxW={{ md: "400px" }} direction="row">
          <LabelText flex={1} label="Network">
            {currentChainId}
          </LabelText>
          <LabelText flex={1} label="Proposed by" minW={0}>
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
